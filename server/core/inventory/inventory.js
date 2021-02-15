onNet("Server.AddItemToInv", async (serverId, itemTbl) => {
    const player = await zFramework.Functions.GetPlayerFromId(serverId);
    //console.log(itemTbl);
    //console.log(player.inventory);
    let currentInventory = player.inventory;
    currentInventory.items[currentInventory.items.lentgh + 1] = itemTbl;
    player.inventory = currentInventory;
    console.log(player.inventory);
});