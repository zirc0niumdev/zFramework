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
	if (!GetPlayerEndpoint(playerId)) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-finding-endpoint");

	let discordIdentifier = null;
	for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
		const identifier = GetPlayerIdentifier(playerId, i);
		if (identifier.includes('discord:')) discordIdentifier = identifier;
	}

	if (discordIdentifier) {
		try {
			await zFramework.Modules.Whitelist.CheckUser(discordIdentifier.replace('discord:', ''));
		} catch (err) {
			deferrals.done("Vous n'êtes pas *Whitelist*.");
		}
	}
	else return deferrals.done("Vous devez lier votre compte Discord à FiveM.");
	
	deferrals.done();
});

onNet('Server.GeneratePlayer', async () => {
	const playerId = global.source;
	if (zFramework.Players[playerId]) return DropPlayer(playerId, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-player-already-connected");

	let identifiers = { license: null, discord: null };
    for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
        const identifier = GetPlayerIdentifier(playerId, i);
		if (identifier.includes('license:')) identifiers.license = identifier;
		if (identifier.includes('discord:')) identifiers.discord = identifier;
    }

	await zFramework.DB.Query('SELECT * FROM players WHERE license = ?', identifiers.license).then(res => {
		// Can simplify that
		// let tempPlayerData = null;
			
		// tempPlayerData = {
		// 	serverId: playerId,
		// 	pedId: GetPlayerPed(playerId),
		// 	playerName: GetPlayerName(playerId),
		// 	spawnLocation: JSON.parse(JSON.stringify({x: -1040.5, y: -2742.8, z: 13.9, heading: 0.0})),
		// 	playerModel: "mp_m_freemode_01",
		// 	playerGroup: zFramework.Groups.PLAYER,
		// 	playerLevel: 0,
		// 	playerRank: zFramework.Ranks.CITIZEN,
		// 	licenseId: identifiers.license,
		// 	discordId: identifiers.discord,
		// 	dead: false,
		// 	firstSpawn: true,
		// 	playerSkin: null,
		// 	playerIdentity: null
		// }
	
		const tempPlayerData = {
			serverId: playerId,
			pedId: GetPlayerPed(playerId),
			playerName: GetPlayerName(playerId),
			spawnLocation: JSON.parse(res[0].location || JSON.stringify({x: -1040.5, y: -2742.8, z: 13.9, heading: 0.0})),
			playerModel: res[0].model || "mp_m_freemode_01",
			playerGroup: res[0].group || zFramework.Groups.PLAYER,
			playerLevel: res[0].level || 0,
			playerRank: res[0].rank || zFramework.Ranks.CITIZEN,
			playerJob: zFramework.Jobs[res[0].job || 1],
			playerJobRank: res[0].job_rank || 0,
			licenseId: res[0].license || identifiers.license,
			discordId: res[0].discord || identifiers.discord,
			dead: res[0].dead || false,
			firstSpawn: res[0] ? false : true,
			playerSkin: JSON.parse(res[0].skin) || null,
			playerIdentity: JSON.parse(res[0].identity) || null
		}
	
		// if (!tempPlayerData) return DropPlayer(playerId, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-initializing-data");
	
		zFramework.Players[playerId] = new CPlayer(tempPlayerData);
	});
});

onNet("Server.onPlayerSpawned", async () => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

	player.initialized = true;
	player.clientEvent('Client.UpdateVar', "initialized", player.initialized);

	// try move that to client side
	for (const command in zFramework.Commands) player.clientEvent('chat:addSuggestion', `/${command}`, zFramework.Commands[command].help, zFramework.Commands[command].arguments);
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