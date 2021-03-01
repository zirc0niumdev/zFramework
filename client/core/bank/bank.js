import * as NativeUI from "../../class/menu/nativeui.js";

let cards = [new NativeUI.ListItem("Aucune")];
const myCardsItem = new NativeUI.UIMenuListItem("Cartes", "", new NativeUI.ItemsCollection(cards));

zFramework.Core.Bank.FetchCBFromInv = () => {
    cards = [];

    for (const [name, obj] of Object.entries(zFramework.LocalPlayer.inventory.items)) {
        if (name === "Carte bancaire") {
            for (const [index, data] of Object.entries(obj)) cards.push(new NativeUI.ListItem(data.name || `CB (${data.uid})`, { index, data }));
        }
    }

    console.log(cards);

    if (cards.length == 0) {
        cards = [new NativeUI.ListItem("Aucune")];
        myCardsItem.Enabled = false;
    }
    
    if (cards[0].DisplayText !== "Aucune" && !myCardsItem.Enabled) myCardsItem.Enabled = true;

    myCardsItem.setCollection(new NativeUI.ItemsCollection(cards));
    myCardsItem.Index = 0;
}

zFramework.Core.Bank.RegisterCentralMenu = () => {
    const menu = new NativeUI.Menu("Banque centrale", "Menu banque", new NativeUI.Point(50, 50));
    const buyCardItem = new NativeUI.UIMenuItem("Demander une nouvelle carte");

    menu.AddItems([myCardsItem, buyCardItem]);

    const myCardsMenu = new NativeUI.Menu(myCardsItem.Text, "Default", new NativeUI.Point(50, 50));
    const cardInfoItem = new NativeUI.UIMenuItem("Voir les infos");
    const changePINItem = new NativeUI.UIMenuItem("Changer le PIN");
    const blockCardItem = new NativeUI.UIMenuItem("~r~Bloquer la carte");

    myCardsMenu.AddItems([cardInfoItem, changePINItem, blockCardItem]);

    menu.AddSubMenu(myCardsMenu, myCardsItem);

    menu.ItemSelect.on(async (item, index) => {
        if (item == myCardsItem) {
            myCardsMenu.SubTitle = myCardsItem.SelectedItem.DisplayText;
            const pin = await zFramework.Functions.KeyboardInput(`Entrez le PIN de ${myCardsItem.SelectedItem.DisplayText}`, "", 4);
            if (!pin || pin !== myCardsItem.SelectedItem.Data.data.card.pin) {
                myCardsMenu.GoBack();
                return zFramework.Functions.Notify("~r~Le code PIN est incorrect.");
            } else zFramework.Functions.Notify("~g~Code PIN bon !");

            if (myCardsItem.SelectedItem.Data.data.blocked) {
                myCardsMenu.GoBack();
                return zFramework.Functions.Notify("~r~Cette carte est inutilisable car elle à été bloqué par son propriétaire.");
            }
        } else if (item == buyCardItem) {
            const pin = await zFramework.Functions.KeyboardInput("Choisissez un PIN pour votre nouvelle carte", "", 4);
            if (!pin || pin === "1234" || pin === "0000" || pin === "AAAA") return;
            if (pin.length < 4) return zFramework.Functions.Notify("~r~Votre PIN doit faire 4 caractères.");
            
            serverEvent("Server.CreateCard", pin);
        }
    });

    myCardsMenu.ItemSelect.on(async (item, index) => {
        const { owner, card, uid} = myCardsItem.SelectedItem.Data.data;

        if (item == cardInfoItem) {
            zFramework.Functions.Notify(`Propriétaire: ~g~${owner.name}~w~`);
            zFramework.Functions.Notify(`Numéro: ~g~${uid}~w~\nPIN: ~g~${card.pin}~w~\nNb. essais restants PIN: ~g~${card.tries}~w~`);
            zFramework.Functions.Notify(`Date de création: ~g~${card.creation}~w~`);
        } else if (item == changePINItem) {
            if (owner.uuid != zFramework.LocalPlayer.UUID) return zFramework.Functions.Notify("~r~Seul le propriétaire peut changer le PIN.");
            const pin = await zFramework.Functions.KeyboardInput("Choisissez un nouveau PIN pour votre carte", "", 4);
            if (!pin || pin === "1234" || pin === "0000" || pin === "AAAA") return;
            if (pin.length < 4) return zFramework.Functions.Notify("~r~Votre PIN doit faire 4 caractères.");
            
            serverEvent("Server.UpdateCard", myCardsItem.SelectedItem.Data.index, pin);
            zFramework.Functions.Notify(`Votre nouveau PIN est: ~g~${pin}~w~.`);
            myCardsMenu.GoBack();
        } else if (item == blockCardItem) {
            if (owner.uuid != zFramework.LocalPlayer.UUID) return zFramework.Functions.Notify("~r~Seul le propriétaire peut bloquer la carte.");
            
            serverEvent("Server.UpdateCard", myCardsItem.SelectedItem.Data.index, true);
            zFramework.Functions.Notify(`~r~Vous avez bloqué la carte ${myCardsItem.SelectedItem.DisplayText}`);
            myCardsMenu.GoBack();
        }
    });

    RegisterCommand("bank", () => {
        menu.Open();
    })
}

zFramework.Core.Bank.Initialize = function() {
    for (const [county, npc] of Object.entries(this.NPCs)) {
        const { model, pos, name } = npc;
        zFramework.Core.NPC.Register({ model, name, pos, text: [name] });
    }

    zFramework.Core.Bank.FetchCBFromInv();
    this.RegisterCentralMenu();
}