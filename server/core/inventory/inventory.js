
onNet("Server.AddItemToInv", async (serverId, itemTbl) => {
    const player = await zFramework.Functions.GetPlayerFromId(serverId);

    player.deleteItem(itemTbl.name, 1);
});