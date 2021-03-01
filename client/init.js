import CLocalPlayer from './class/CLocalPlayer.js';

RegisterCommand("respawn", () => serverEvent("Server.GeneratePlayer"));

onNet('Client.CreatePlayer', tempPlayerData => {
	if (zFramework.LocalPlayer) return;
	zFramework.LocalPlayer = new CLocalPlayer(tempPlayerData);
});