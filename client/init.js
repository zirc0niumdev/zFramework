import CLocalPlayer from './class/CLocalPlayer.js';

const waitingForPlayer = setInterval(async () => {
	while (!NetworkIsPlayerActive(PlayerId()))
		await Delay(0);

	serverEvent('Server.GeneratePlayer');
	clearInterval(waitingForPlayer);
}, 150);

onNet('Client.CreatePlayer', tempPlayerData => {
	if (zFramework.LocalPlayer) return;
	zFramework.LocalPlayer = new CLocalPlayer(tempPlayerData);
});
 
on("onPlayerSpawn", () => {
	UpdateVar("pedId", PlayerPedId());

	for (let i = 1; i <= 15; i++) EnableDispatchService(i, false);
	DisablePlayerVehicleRewards(zFramework.LocalPlayer.pedId);
	N_0x170f541e1cadd1de(false); // Related to displaying cash on the HUD
	NetworkSetFriendlyFireOption(true); 
	SetPoliceIgnorePlayer(zFramework.LocalPlayer.pedId, true);
	SetMaxWantedLevel(0);
	SetCreateRandomCops(false);
	SetCreateRandomCopsOnScenarios(false);
	SetCreateRandomCopsNotOnScenarios(false);

	zFramework.Modules.Initialize();
	zFramework.Core.Initialize();
	
	serverEvent("Server.onPlayerSpawned");
});