onNet("Server.CreateCard", async pin => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

    const data = {
        owner: {
            name: `${player.identity.lastname} ${player.identity.firstname}`,
            uuid: player.uuid
        },
        card: {
            pin,
            tries: 5,
            creation: getDate(),
        },
        uid: zFramework.Core.Bank.GenerateUID(player.uuid)
    }

    if (!zFramework.Core.Inventory.CanCarryItem(player.inventory, "Carte bancaire", 1, zFramework.Core.Inventory.PlayerWeight)) return player.notify("~r~Vous ne pouvez pas porter plus d'objet.");

    player.addItem("Carte bancaire", 1, data);
    player.notify(`~b~Carte bancaire (${data.uid})~g~ créé avec succès`);
});

onNet("Server.UpdateCard", async (num, value) => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
    let item = player.inventory.items["Carte bancaire"][num];
    console.log(item);
    if (!item) return;

    if (typeof(value) === "boolean") item.blocked = value;
    else {
        item.card.pin = value;
        if (item.card.tries < 5) item.card.tries = 5;
    }
    
    player.clientEvent('Client.UpdateInventory', player.inventory, "Carte bancaire");
});