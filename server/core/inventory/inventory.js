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

onNet("Server.Inventory.TransferItem", async (targetId, name, keys) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    const target = await zFramework.Functions.GetPlayerFromId(targetId);

    if (!zFramework.Core.Inventory.CanCarryItem(target.inventory, name, keys.length, zFramework.Core.Inventory.PlayerWeight)) return player.notify("~r~Cette personne ne peut pas porter plus d'objet.");

    for (const num of keys) {
        const data = player.getItemData(name, num);
        target.addItem(name, 1, data);
    }

    player.deleteItem(name, keys);

    target.notify(`~g~Quelqu'un vous à donné ~b~${keys.length}x ${name}~s~.`);
    player.notify(`~g~Vous avez donné ~b~${keys.length}x ${name}~s~.`);
});

onNet("Server.Inventory.GiveMoney", async (type, targetId, amount, pos) => {
    type = type === "Argent" ? "money" : type === "Argent Sale" ? "dirtyMoney" : null;
    if (!type || player[type] < amount) return;

    const player = await zFramework.Functions.GetPlayerFromId(global.source);

    player[type] -= amount;

    if (!targetId) {
        // const itemTbl = zFramework.Core.Inventory.Pickups.push(
        // {
        //     name: type,
        //     pos,
        //     amount
        // });

        // player.clientEvent("Client.Pickup.Management", 1, { id: itemTbl, name: type, model: "ng_proc_box_01a", pos, amount });
        // player.notify(`~g~Vous avez laché ~b~${amount}$~s~.`);
    } else {    
        const target = await zFramework.Functions.GetPlayerFromId(targetId);

        target[type] += amount;

        target.notify(`~g~Quelqu'un vous à donné ~b~${amount}$~s~.`);
        player.notify(`~g~Vous avez donné ~b~${amount}$~s~.`);
    }
});