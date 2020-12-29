import CLocalPlayer from './class/CLocalPlayer.js';

const waitingForPlayer = setTick(() => {
	if (NetworkIsPlayerActive(PlayerId())) {
		serverEvent('Server.GeneratePlayer');
		clearTick(waitingForPlayer);
	}
});

on("onPlayerSpawn", () => {
	UpdateVar("pedId", PlayerPedId());

	DisablePlayerVehicleRewards(zFramework.LocalPlayer.pedId);
	N_0x170f541e1cadd1de(false); // Related to displaying cash on the HUD
	NetworkSetFriendlyFireOption(true);

	SetPoliceIgnorePlayer(zFramework.LocalPlayer.pedId, true);
	SetMaxWantedLevel(0);
	SetCreateRandomCops(false);
	SetCreateRandomCopsOnScenarios(false);
	SetCreateRandomCopsNotOnScenarios(false);
    
	for (let i = 1; i <= 15; i++) EnableDispatchService(i, false);
    
	zFramework.Functions.DiscordInit();
	zFramework.Modules.InitializeModules();
	
	serverEvent("Server.onPlayerSpawned");
});

onNet('Client.CreatePlayer', (tempPlayerData) => {
	if (zFramework.LocalPlayer) return;
	
	zFramework.LocalPlayer = new CLocalPlayer(tempPlayerData);
});