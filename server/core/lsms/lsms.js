onNet("Server.LSMS.SetDead", async toggle => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.dead = toggle;
});

onNet("Server.LSMS.Action", async (action, value) => {
    const target = await zFramework.Functions.GetPlayerFromId(value.targetId || value);
    target.clientEvent("Client.LSMS.Action", action, value);
});