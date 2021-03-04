onNet("Server.Bank.CreateCard", async pin => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

    const data = {
        owner: {
            name: `${player.identity.lastname} ${player.identity.firstname}`,
            uuid: player.UUID
        },
        card: {
            pin,
            tries: 5,
            creation: getDate(),
        },
        uid: zFramework.Core.Bank.GenerateUID(player.UUID)
    }

    if (!zFramework.Core.Inventory.CanCarryItem(player.inventory, "Carte bancaire", 1, zFramework.Core.Inventory.PlayerWeight)) return player.notify("~r~Vous ne pouvez pas porter plus d'objet.");

    player.addItem("Carte bancaire", 1, data);
    player.notify(`~b~Carte bancaire (${data.uid})~g~ créé avec succès`);
});

onNet("Server.Bank.UpdateCard", async (num, value) => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
    let item = player.inventory.items["Carte bancaire"][num];
    if (!item) return;

    if (typeof(value) === "boolean") item.blocked = value;
    else {
        item.card.pin = value;
        if (item.card.tries < 5) item.card.tries = 5;
    }
    
    player.clientEvent('Client.UpdateInventory', player.inventory, "Carte bancaire");
});

onNet("Server.Bank.UpdateSolde", async (type, amount, targetUuid) => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

    amount = parseInt(amount);
    switch (type) {
        case 1:
            if (player.bank - amount < 0) return player.notify("~r~Vous n'avez pas assez d'argent sur votre compte.");
            player.bank -= amount;
            player.money += amount;
            player.notify(`~g~Vous~s~ avez retiré ~b~$${amount}.`);
            break;
        case 2:
            if (player.money - amount < 0) return player.notify("~r~Vous n'avez pas assez d'argent.");
            player.money -= amount;
            player.bank += amount;
            player.notify(`~g~Vous~s~ avez déposé ~b~$${amount}.`);
            break;
        case 3:
            const target = await zFramework.Functions.GetPlayerFromUuid(targetUuid);
            if (player.bank - amount < 0) return player.notify("~r~Vous n'avez pas assez d'argent sur votre compte.");
            player.bank -= amount;
            target.bank += amount;
            player.notify(`Vous avez transféré ~b~$${amount}~s~ sur le compte de ~g~${target.identity.lastname} ${target.identity.firstname}.`);
            target.notify(`~g~${player.identity.lastname} ${player.identity.firstname}~s~ à transféré ~b~$${amount}~s~ sur votre compte.`);
            break;
    }
});