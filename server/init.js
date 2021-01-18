import CPlayer from './class/CPlayer.js';

zFramework.Functions.onReady = function() {
	if (zFramework.Initialized) return;

	zFramework.Modules.Initialize();
	zFramework.Initialized = true;
	console.log("\x1b[33m[zFramework] \x1b[32mzFramework is ready!\x1b[37m");
}

on("playerConnecting", async(_, __, deferrals) => {
	const player = global.source;

	console.log(`${GetPlayerName(player)} joined!`);

	deferrals.defer();
	await Delay(500);
	deferrals.update("Vérification...");
	await Delay(500);
	if (!zFramework.Initialized) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-server-starting");
	if (!GetPlayerEndpoint(player)) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-finding-endpoint");

	// VPN Check
	//let geo = geoip.lookup(GetPlayerEndpoint(player));
	//if (!geo) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-geo-module-null");
	//if (geo.country != "FR" && geo.country != "BE" && geo.country != "CA" && geo.country != "CH") return deferrals.done("Tu as un VPN ? Bye.");

	// Ban Check

	// Whitelist Module Check
	
	deferrals.done();
});

onNet('Server.GeneratePlayer', async() => {
	const player = global.source;
	if (zFramework.Players[player]) return DropPlayer(player, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-player-already-connected");

	let identifiers = { license: null, discord: null };
    for(let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
        const identifier = GetPlayerIdentifier(player, i);

		if (identifier.includes('license:'))
			identifiers.license = identifier;
			
		if (identifier.includes('discord:')) 
			identifiers.discord = identifier;
    }

	if (!identifiers.discord) return DropPlayer(player, "Vous devez lier votre compte Discord à FiveM.");

	await zFramework.DB.Query('SELECT * FROM players WHERE license = ?', identifiers.license).then(async res => {
		// Can simplify that
		let tempPlayerData = null;
		
		tempPlayerData = {serverId: player, pedId: GetPlayerPed(player), playerName: GetPlayerName(player), spawnLocation: JSON.parse(JSON.stringify({x: -1040.5, y: -2742.8, z: 13.9, heading: 0.0})), playerModel: "mp_m_freemode_01", licenseId: identifiers.license, discordId: identifiers.discord, dead: false, playerLevel: 0, playerGroup: zFramework.Groups.PLAYER, playerRank: zFramework.Ranks.CITIZEN, firstSpawn: true, playerIdentity: null, playerSkin: null};

		if (res[0] || res[0].license) {
			tempPlayerData = {serverId: player, pedId: GetPlayerPed(player), playerName: GetPlayerName(player), spawnLocation: JSON.parse(res[0].location), playerModel: res[0].model, licenseId: res[0].license, discordId: res[0].discord, dead: res[0].dead, playerLevel: res[0].level, playerGroup: res[0].group, playerRank: res[0].rank, playerSkin: JSON.parse(res[0].skin), playerIdentity: JSON.parse(res[0].identity)};
		}

		if (!tempPlayerData) return DropPlayer(player, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-initializing-data");

		zFramework.Players[player] = new CPlayer(tempPlayerData);
	});
});

onNet("Server.onPlayerSpawned", () => {
	const player = zFramework.Players[global.source];
	if (!player) return;

	player.initialized = true;
	player.clientEvent('Client.UpdateVar', "initialized", player.initialized);
});

on("playerDropped", (reason) => {
	const player = zFramework.Players[global.source];
	if (!player) return;
	console.log(`${player.name} disconnected - ${reason}`);

	player.savePlayer().then(() => {
		zFramework.Players[player.serverId] = null;
	});
});

onNet("chatMessage", (_, __, message) => {
	if (!message.includes('/')) return CancelEvent();

	const commands = GetRegisteredCommands();
	for (const index in commands) {
		const cmdname = commands[index]['name'];
		  
		if (message.slice('/') != cmdname) {
			emitNet('chat:addMessage', -1, { args: [ "Commande Invalide."] });
			CancelEvent();
			break;
		}
	}
});