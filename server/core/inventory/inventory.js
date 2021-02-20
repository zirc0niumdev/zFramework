onNet("Server.Inventory.AddItem", async (name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.addItem(name, amount);
});

onNet("Server.Inventory.DeleteItem", async (name, amount, index = null) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.deleteItem(name, amount, index);
});

onNet("Server.Inventory.ChangeSlot", async (key, value) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.changeWeaponSlot(key, value);
});

onNet("Server.Inventory.UpdateItem", async (index, type, key, value, isData = false) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.setItem(index, type, key, value, isData);
});