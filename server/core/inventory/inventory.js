onNet("Server.Inventory.AddItem", async (name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.addItem(name, amount);
});

onNet("Server.Inventory.DeleteItem", async (name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.deleteItem(name, amount);
});

onNet("Server.Inventory.ChangeSlot", async (key, value) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.changeWeaponSlot(key, value);
});

onNet("Server.Inventory.UpdateItemData", async (name, key, value) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.setItemData(name, key, value);
});