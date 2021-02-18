
onNet("Server.AddItem", async (serverId, name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(serverId);
    console.log("additem");
    player.addItem(name, amount);
});

onNet("Server.DeleteItem", async (name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);

    player.deleteItem(name, amount);
});