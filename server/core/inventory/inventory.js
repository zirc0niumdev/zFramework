
onNet("Server.AddItemToInv", async (serverId, itemTbl) => {
    const player = await zFramework.Functions.GetPlayerFromId(serverId);

    player.addItem(itemTbl.name, 1, true);
});