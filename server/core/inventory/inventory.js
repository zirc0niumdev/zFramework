onNet("Server.Inventory.AddItem", async (name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.addItem(name, amount);
});

onNet("Server.Inventory.DeleteItem", async (name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.deleteItem(name, amount);
});

onNet("Server.Inventory.ChangeSlot", async (name, value) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.changeWeaponSlot(name, value);
});