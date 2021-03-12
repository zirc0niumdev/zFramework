import CLocalPlayer from './class/CLocalPlayer.js';

RegisterCommand("respawn", () => serverEvent("Server.GeneratePlayer"));

onNet('Client.CreatePlayer', tempPlayerData => {
	if (zFramework.LocalPlayer); //return serverEvent("Server.Kick", "Une erreur à été rencontrée lors de votre connexion. Code Erreur: error-player-already-exists");
	zFramework.LocalPlayer = new CLocalPlayer(tempPlayerData);
});

on("gameEventTriggered", (name, args) => {
    if (name == "CEventNetworkEntityDamage") {
        let i = 0;
        const victim = args[i++];
        const instigator = args[i++];
  
        i++; // skip unknown default boolean value
        i++; // skip unknown 2060 new boolean value
        i++; // skip unknown 2189 new boolean value
  
        const isFatal = !!args[i++];
        const weaponHash = args[i++];

        // consume data
        zFramework.Core.LSMS.OnEntityDamage(victim, instigator, isFatal, weaponHash);
    }
});