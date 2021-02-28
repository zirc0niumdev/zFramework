import CLocalPlayer from './class/CLocalPlayer.js';

onNet('Client.CreatePlayer', tempPlayerData => {
	if (zFramework.LocalPlayer) return;
	zFramework.LocalPlayer = new CLocalPlayer(tempPlayerData);
});