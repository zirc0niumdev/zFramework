onNet("Server.Inventory.AddItem", async (name, keys) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.addItem(name, keys);
});

// onNet("Server.Inventory.DeleteItem", async (name, amount, data = {}) => {
//     const player = await zFramework.Functions.GetPlayerFromId(global.source);
//     player.deleteItem(name, amount, data);
// });

onNet("Server.Inventory.ChangeSlot", async (key, value) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.changeWeaponSlot(key, value);
});

// onNet("Server.Inventory.UpdateItem", async (index, type, key, value, isData = false) => {
//     const player = await zFramework.Functions.GetPlayerFromId(global.source);
//     //player.setItem(index, type, key, value, isData);
// });

// onNet("Server.Inventory.TransferItem", async (targetId, item, index, amount) => {
//     const player = await zFramework.Functions.GetPlayerFromId(global.source);
//     const target = await zFramework.Functions.GetPlayerFromId(targetId);

//     if (!target.canCarryItem(item.name, amount)) return;

//     // target.addItem();
//     // player.deleteItem(name, qty, index);
// });