onNet("Server.Inventory.ManageItem", async (name, num) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    if (typeof(num) === "object") player.deleteItem(name, num[0]);
    else player.addItem(name, num);
});

onNet("Server.Inventory.ChangeSlot", async (key, value) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.changeWeaponSlot(key, value);
});

onNet("Server.Inventory.UpdateItem", async (name, num, data = {}) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.updateItem(name, num, data);
});

// onNet("Server.Inventory.TransferItem", async (targetId, item, index, amount) => {
//     const player = await zFramework.Functions.GetPlayerFromId(global.source);
//     const target = await zFramework.Functions.GetPlayerFromId(targetId);

//     if (!target.canCarryItem(item.name, amount)) return;

//     // target.addItem();
//     // player.deleteItem(name, qty, index);
// });