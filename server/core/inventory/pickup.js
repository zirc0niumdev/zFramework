// zFramework.Core.Inventory.Pickups = [];

// onNet("Server.Pickup.Management", async (action, item) => {
//     const player = await zFramework.Functions.GetPlayerFromId(global.source);

//     if (action === 1) {
//         player.deleteItem(item.name, item.amount);

//         const itemTbl = zFramework.Core.Inventory.Pickups.push(
//         {
//             name: item.name,
//             pos: item.pos,
//             amount: item.amount
//         });

//         item.id = itemTbl;
//         item.model = "ng_proc_box_01a";

//         player.clientEvent("Client.Pickup.Management", action, item);
//         player.notify(`~g~Vous avez laché ~b~${item.amount}x ${item.name}~s~.`);
//     } else if (action === 3) {
//         if (!zFramework.Core.Inventory.CanCarryItem(player.inventory, item.name, item.amount, zFramework.Core.Inventory.PlayerWeight)) return player.notify("~r~Vous ne pouvez pas porter plus d'objet.");

//         player.addItem(item.name, item.amount);

//         zFramework.Core.Inventory.Pickups.splice(item.id, 1);

//         emitNet('Client.Pickup.Management', -1, action, item);
//         player.notify(`~g~Vous avez ramassé ~b~${item.amount}x ${item.name}~s~.`);
//     }
// });