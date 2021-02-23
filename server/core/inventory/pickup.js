zFramework.Core.Inventory.Pickups = [];

onNet("Server.Pickup.Management", async (action, item) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);

    switch (action) {
        case 1:
            player.deleteItem(item.name, item.amount);
            const model = "v_serv_abox_02";

            let datas = {};
            for (const num of item.amount) {
                const data = player.getItemData(item.name, num);
                datas[num] = data;
            }
    
            const itemTbl = zFramework.Core.Inventory.Pickups.push(
            {
                pos: item.pos,
                model,
                value: { name: item.name, data: datas }
            });
    
            player.clientEvent("Client.Pickup.Management", 1, { id: itemTbl - 1, model, pos: item.pos });
            player.notify(`~g~Vous avez laché ~b~${item.amount.length}$~s~.`);

            break;
    
        case 3:
            const pickup = zFramework.Core.Inventory.Pickups[item.id];
            if (!pickup) return;
            
            if (pickup.value.name.includes("money")) player[pickup.value.name] += pickup.value.amount;
            else {
                if (!zFramework.Core.Inventory.CanCarryItem(player.inventory, pickup.value.name, Object.keys(pickup.value.data).length, zFramework.Core.Inventory.PlayerWeight)) return player.notify("~r~Vous ne pouvez pas porter plus d'objet.");
                for (const data of Object.values(pickup.value.data)) player.addItem(pickup.value.name, 1, data);
            }
    
            zFramework.Core.Inventory.Pickups.splice(item.id, 1);

            emitNet('Client.Pickup.Management', -1, action, item.id);

            player.notify(`~g~Vous avez ramassé ~b~${pickup.value.amount && typeof(pickup.value.amount) === "number" ? `${pickup.value.amount}$` : `${pickup.value.data.length}x ${pickup.value.name}`}~s~.`);

            break;
    }
});