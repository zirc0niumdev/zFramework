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

onNet("Server.Inventory.TransferItem", async (targetId, name, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    const target = await zFramework.Functions.GetPlayerFromId(targetId);

    if (!zFramework.Core.Inventory.CanCarryItem(target.inventory, name, amount.length, zFramework.Core.Inventory.PlayerWeight)) return player.notify("~r~Cette personne ne peut pas porter plus d'objet.");

    for (const key of amount){
        const data = player.getItemData(name, key) || {};

        target.addItem(name, 1, data);
        player.deleteItem(name, 1, data);
    }

    target.notify(`~g~Quelqu'un vous à donné ~b~${amount.length}x ${name}~s~.`);
    player.notify(`~g~Vous avez donné ~b~${amount.length}x ${name}~s~.`);
});

onNet("Server.Inventory.GiveMoney", async (type, targetId, amount, pos) => {
    type = type === "Argent" ? "money" : type === "Argent Sale" ? "dirtyMoney" : null;
    if (!type) return;

    const player = await zFramework.Functions.GetPlayerFromId(global.source);

    if (!targetId) {

    } else {
        if (player[type] < amount) return;
    
        const target = await zFramework.Functions.GetPlayerFromId(targetId);

        target[type] += amount;
        player[type] -= amount;

        target.notify(`~g~Quelqu'un vous à donné ~b~${amount}$~s~.`);
        player.notify(`~g~Vous avez donné ~b~${amount}$~s~.`);
    }
});