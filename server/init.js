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

	console.log(`[${global.source}] ${GetPlayerName(playerId)} joined!`);

	deferrals.defer();
	
	await Delay(500);

	if (!zFramework.Initialized) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-server-starting");
	if (!GetPlayerEndpoint(playerId)) return deferrals.done("Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-finding-endpoint");

	// Identifiers verification
	let identifiers = null;
	try {
		deferrals.update('Vérification identifiers...');
		identifiers = await zFramework.Functions.CheckIdentifiers(playerId);
	} catch (err) {
		deferrals.done(err);
	}

	if (!identifiers) return deferrals.done('Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-identifiers-null');

	// Ban verification	
	if (zFramework.Modules.List.Ban && zFramework.Modules.Ban.Initialized) {
		try {
			deferrals.update('Vérification banlist...');
			await zFramework.Modules.Ban.CheckUser(identifiers);
		} catch(err) {
			deferrals.done(err);
		}
	}

	// Whitelist verification
	if (zFramework.Modules.List.Whitelist && zFramework.Modules.Whitelist.Initialized) {
		try {
			deferrals.update('Vérification whitelist...');
			await zFramework.Modules.Whitelist.CheckUser(identifiers.discord.replace('discord:', ''));
		} catch(err) {
			deferrals.done(err);
		}
	}
	
	deferrals.done();
});

onNet('Server.GeneratePlayer', async () => {
	const playerId = global.source;
	if (zFramework.Players[playerId]) return DropPlayer(playerId, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-player-already-connected");

	const identifiers = zFramework.Functions.GetIdentifiersFromId(playerId);

	await zFramework.Database.Query('SELECT * FROM players WHERE license = ?', identifiers.license).then(async res => {
		const tempPlayerData = {
			serverId: playerId,
			pedId: GetPlayerPed(playerId),
			playerName: GetPlayerName(playerId),
			spawnLocation: res[0] ? JSON.parse(res[0].location) : { x: -1040.5, y: -2742.8, z: 13.9, heading: 0.0 },
			playerModel: res[0] ? res[0].model : "mp_m_freemode_01",
			playerGroup: res[0] ? res[0].group : zFramework.Groups.PLAYER,
			playerLevel: res[0] ? res[0].level : 0,
			playerRank: res[0] ? res[0].rank : zFramework.Ranks.CITIZEN,
			playerJob: await zFramework.Jobs.GetJobFromId(res[0] ? res[0].job : 1),
			playerJobRank: res[0] ? res[0].job_rank : 0,
			playerInventory: res[0] ? JSON.parse(res[0].inventory) : { items: [], clothes: [], weight: 0, weaponOne: "", weaponTwo: "", weaponThree: "" },
			licenseId: res[0] ? res[0].license : identifiers.license,
			discordId: res[0] ? res[0].discord : identifiers.discord,
			dead: res[0] ? res[0].dead : false,
			firstSpawn: res[0] ? false : true,
			playerSkin: res[0] ? JSON.parse(res[0].skin) : null,
			playerIdentity: res[0] ? JSON.parse(res[0].identity) : null
		}
		
		zFramework.Players[playerId] = new CPlayer(tempPlayerData);	
	});
});

onNet("Server.onPlayerSpawned", async () => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	console.log(`[${global.source}] ${player.name} spawned!`);

	player.initialized = true;
	player.clientEvent('Client.UpdateVar', "initialized", player.initialized);

	// try move that to client side
	for (const command in zFramework.Commands)
		player.clientEvent('chat:addSuggestion', `/${command}`, zFramework.Commands[command].help, zFramework.Commands[command].arguments);
});

on("playerDropped", async reason => {
	console.log(`[${global.source}] ${GetPlayerName(global.source)} disconnected - Reason: ${reason}`);
	
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	player.savePlayer().then(() => zFramework.Players[player.serverId] = null);
});

// Simplify that
onNet("chatMessage", (_, __, message) => {
	if (!message.includes('/')) return CancelEvent();

	const commands = GetRegisteredCommands();
	for (const index in commands) {
		const cmdname = commands[index]['name'];
		
		if (message.slice('/') != cmdname) {
			emitNet('chat:addMessage', -1, { args: [ "Commande Invalide." ] });
			CancelEvent();
			break;
		}
	}
});