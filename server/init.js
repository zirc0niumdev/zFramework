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

	zFramework.Functions.Logs(`[${global.source}] ${GetPlayerName(playerId)} joined!`);

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
	if (zFramework.Players[playerId]) return DropPlayer(playerId, "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-player-already-exists");

	const identifiers = zFramework.Functions.GetIdentifiersFromId(playerId);
	await zFramework.Database.Query('SELECT * FROM players WHERE rockstar = ?', identifiers.license)
	.then(async res => {
		const tempPlayerData = JSON.stringify({
			serverId: playerId,
			pedId: GetPlayerPed(playerId),
			UUID: res[0] && res[0].uuid || zFramework.Functions.GenerateUUID(),
			name: GetPlayerName(playerId),
			spawnLocation: res[0] && JSON.parse(res[0].location) || { x: -1040.5, y: -2742.8, z: 13.9, heading: 0.0 },
			model: res[0] && res[0].model || "mp_m_freemode_01",
			sex: res[0] && res[0].sex || 0,
			money: res[0] && res[0].money || 250,
			dirtyMoney: res[0] && res[0].dirtyMoney || 0,
			bank: res[0] && res[0].bank || 500,
			character: res[0] && JSON.parse(res[0].character) || null,
			needs: res[0] && JSON.parse(res[0].needs) || { hunger: 100, thirst: 100, health: 200 },
			inventory: res[0] && JSON.parse(res[0].inventory) || { items: {}, weight: 0, weaponOne: "", weaponTwo: "", weaponThree: "" },
			licenses: { rockstar: res[0] && res[0].license || identifiers.license, discord: res[0] && res[0].discord || identifiers.discord },
			dead: res[0] && res[0].dead || false,
			rank: res[0] && res[0].rank || zFramework.Ranks.CITIZEN,
			group: res[0] && res[0].group || zFramework.Groups.PLAYER,
			job: await zFramework.Jobs.GetJobFromId(res[0] && res[0].job || 1),
			jobRank: res[0] && res[0].job_rank || 0,
			firstSpawn: !res[0] && true || false
		});

		zFramework.Players[playerId] = new CPlayer(tempPlayerData);	
	});
});

onNet("Server.onPlayerSpawned", async () => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	zFramework.Functions.Logs(`[${global.source}] ${player.name} spawned!`);

	player.setLocation(player.spawnLocation);

	if (player.firstSpawn) {
		player.addItem("Pain", 4);
		player.addItem("Eau de source", 8);
		// player.addItem("Carte d'identité", 1, { identity: player.identity, uid: player.UUID, exp: zFramework.Functions.GenerateExpDate() });
		// add telephone
	}

	// Load Pickups
	if (Object.keys(zFramework.Core.Inventory.Pickups).length > 0)
		player.clientEvent("Client.Pickup.Management", 2, zFramework.Core.Inventory.Pickups);

	// Load Commands Suggestions
	for (const command in zFramework.Commands)
		player.clientEvent('chat:addSuggestion', `/${command}`, zFramework.Commands[command].help, zFramework.Commands[command].arguments);

	player.initialized = true;
});

on("playerDropped", async reason => {
	zFramework.Functions.Logs(`[${global.source}] ${GetPlayerName(global.source)} disconnected - Reason: ${reason}`);
	
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	player.savePlayer().then(() => delete zFramework.Players[player.serverId]);
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