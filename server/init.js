import CPlayer from './class/CPlayer.js';

zFramework.Functions.onReady = () => {
	if (zFramework.Initialized) return;

	zFramework.Modules.Initialize();
	zFramework.Initialized = true;
	console.log("\x1b[33m[zFramework] \x1b[32mzFramework is ready!\x1b[37m");
}

// Simplify that
on("playerConnecting", async (_, __, deferrals) => {
	const playerId = global.source;

	console.log(`${GetPlayerName(playerId)} joined!`);

	deferrals.defer();
	await Delay(500);
	if (!zFramework.Initialized) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-server-starting");
	if (!GetPlayerEndpoint(player)) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-finding-endpoint");

	// Ban Check
	// Whitelist Module Check
	
	deferrals.done();
});

onNet('Server.GeneratePlayer', async () => {
	const playerId = global.source;
	if (await zFramework.Functions.GetPlayerFromId(playerId)) return DropPlayer(playerId, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-player-already-connected");

	// Move that to Connection Event
	let identifiers = { license: null, discord: null };
    for(let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
        const identifier = GetPlayerIdentifier(playerId, i);
		if (identifier.includes('license:')) identifiers.license = identifier;
		if (identifier.includes('discord:')) identifiers.discord = identifier;
    }

	if (!identifiers.discord) return DropPlayer(playerId, "Vous devez lier votre compte Discord à FiveM.");

	await zFramework.DB.Query('SELECT * FROM players WHERE license = ?', identifiers.license).then(res => {
		// Can simplify that
		let tempPlayerData = null;
			
		tempPlayerData = { serverId: playerId, pedId: GetPlayerPed(playerId), playerName: GetPlayerName(playerId), spawnLocation: JSON.parse(JSON.stringify({x: -1040.5, y: -2742.8, z: 13.9, heading: 0.0})), playerModel: "mp_m_freemode_01", licenseId: identifiers.license, discordId: identifiers.discord, dead: false, playerLevel: 0, playerGroup: zFramework.Groups.PLAYER, playerRank: zFramework.Ranks.CITIZEN, firstSpawn: true, playerIdentity: null, playerSkin: null} ;
	
		if (res[0]) tempPlayerData = {
			serverId: playerId,
			pedId: GetPlayerPed(playerId),
			playerName: GetPlayerName(playerId),
			spawnLocation: JSON.parse(res[0].location),
			playerModel: res[0].model,
			playerGroup: res[0].group,
			playerLevel: res[0].level,
			playerRank: res[0].rank,
			playerJob: zFramework.Jobs[res[0].job],
			playerJobRank: res[0].job_rank,
			licenseId: res[0].license,
			discordId: res[0].discord,
			dead: res[0].dead,
			playerSkin: JSON.parse(res[0].skin),
			playerIdentity: JSON.parse(res[0].identity)
		};
	
		if (!tempPlayerData) return DropPlayer(playerId, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-initializing-data");
	
		zFramework.Players[playerId] = new CPlayer(tempPlayerData);
	});
});

onNet("Server.onPlayerSpawned", async () => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

	player.initialized = true;
	player.clientEvent('Client.UpdateVar', "initialized", player.initialized);
});

on("playerDropped", async reason => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	console.log(`${player.name} disconnected - ${reason}`);

	player.savePlayer().then(() => zFramework.Players[player.serverId] = null);
});

// Simplify that
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