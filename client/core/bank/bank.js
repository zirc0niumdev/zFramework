import CBlip from "../../class/CBlip.js";
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

    if (cards.length == 0) {
        cards = [new NativeUI.ListItem("Aucune")];
        myCardsItem.Enabled = false;
    }
    
    if (cards[0].DisplayText !== "Aucune" && !myCardsItem.Enabled) myCardsItem.Enabled = true;

    myCardsItem.setCollection(new NativeUI.ItemsCollection(cards));
    myCardsItem.Index = 0;
}

const centralMenu = new NativeUI.Menu("Banque centrale", "Menu principal", new NativeUI.Point(50, 50));
function registerCentralMenu() {
    const buyCardItem = new NativeUI.UIMenuItem("Demander une nouvelle carte");

    centralMenu.AddItems([myCardsItem, buyCardItem]);

    const myCardsMenu = new NativeUI.Menu(myCardsItem.Text, "Default", new NativeUI.Point(50, 50));
    const cardInfoItem = new NativeUI.UIMenuItem("Voir les infos");
    const changePINItem = new NativeUI.UIMenuItem("Changer le PIN");
    const blockCardItem = new NativeUI.UIMenuItem("~r~Bloquer la carte");

    myCardsMenu.AddItems([cardInfoItem, changePINItem, blockCardItem]);

    centralMenu.AddSubMenu(myCardsMenu, myCardsItem);

    centralMenu.ItemSelect.on(async (item, index) => {
        if (item == myCardsItem) {
            myCardsMenu.SubTitle = myCardsItem.SelectedItem.DisplayText;
            const pin = await zFramework.Functions.KeyboardInput(`Entrez le PIN de ${myCardsItem.SelectedItem.DisplayText}`, "", 4);
            if (!pin || pin !== myCardsItem.SelectedItem.Data.data.card.pin) {
                myCardsMenu.GoBack();
                return zFramework.Functions.Notify("~r~Le code PIN est incorrect.");
            }

            if (myCardsItem.SelectedItem.Data.data.blocked) {
                myCardsMenu.GoBack();
                return zFramework.Functions.Notify("~r~Cette carte est inutilisable car elle à été bloqué par son propriétaire.");
            }

            zFramework.Functions.Notify("~g~Code PIN bon !");
        } else if (item == buyCardItem) {
            const pin = await zFramework.Functions.KeyboardInput("Choisissez un PIN pour votre nouvelle carte", "", 4);
            const check = checkPIN(pin);
            if (!check) return;
            
            serverEvent("Server.Bank.CreateCard", pin);
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
            const check = checkPIN(pin);
            if (!check) return;

            serverEvent("Server.Bank.UpdateCard", myCardsItem.SelectedItem.Data.index, pin);
            zFramework.Functions.Notify(`Votre nouveau PIN est: ~g~${pin}~w~.`);
            myCardsMenu.GoBack();
        } else if (item == blockCardItem) {
            if (owner.uuid != zFramework.LocalPlayer.UUID) return zFramework.Functions.Notify("~r~Seul le propriétaire peut bloquer la carte.");
            
            serverEvent("Server.Bank.UpdateCard", myCardsItem.SelectedItem.Data.index, true);
            zFramework.Functions.Notify(`~r~Vous avez bloqué la carte ${myCardsItem.SelectedItem.DisplayText}`);
            myCardsMenu.GoBack();
        }
    });

    centralMenu.MenuOpen.on(() => zFramework.LocalPlayer.blockInput = true);
    centralMenu.MenuClose.on(() => zFramework.LocalPlayer.blockInput = false);
}

zFramework.Core.Bank.OpenBank = () => centralMenu.Open();

function checkPIN(pin) {
    if (!pin || pin === "1234" || pin === "0000" || pin === "AAAA") return false;
    if (pin.length < 4) {
        zFramework.Functions.Notify("~r~Votre PIN doit faire 4 caractères.");
        return false;
    }

    return true;
}

const atmMenu = new NativeUI.Menu("ATM", "Default", new NativeUI.Point(50, 50));
function registerATMMenu() {
    const retraitItem = new NativeUI.UIMenuItem("Retrait");
    const depotItem = new NativeUI.UIMenuItem("Dépot");
    const transfertItem = new NativeUI.UIMenuItem("Transfert");

    atmMenu.AddItems([retraitItem, depotItem, transfertItem]);
    
    zFramework.Core.Bank.SetSolde();

    atmMenu.ItemSelect.on(async (item, index) => {
        if (item == retraitItem) {
            const amount = await zFramework.Functions.KeyboardInput("Entrez un montant à retirer", "", 8);
            if (!amount) return;
            if (zFramework.LocalPlayer.bank - amount < 0) return zFramework.Functions.Notify("~r~Vous n'avez pas assez d'argent sur votre compte.");
            
            serverEvent("Server.Bank.UpdateSolde", 1, amount);
        } else if (item == depotItem) {
            const amount = await zFramework.Functions.KeyboardInput("Entrez un montant à déposer", "", 8);
            if (!amount) return;
            if (zFramework.LocalPlayer.money - amount < 0) return zFramework.Functions.Notify("~r~Vous n'avez pas assez d'argent.");
            
            serverEvent("Server.Bank.UpdateSolde", 2, amount);
        } else if (item == transfertItem) {
            const amount = await zFramework.Functions.KeyboardInput("Entrez un montant à transférer", "", 8);
            if (!amount) return;
            if (zFramework.LocalPlayer.bank - amount < 0) return zFramework.Functions.Notify("~r~Vous n'avez pas assez d'argent.");
            const uuid = await zFramework.Functions.KeyboardInput("Entrez un numéro de compte", "", 13);
            if (!uuid) return;
            
            serverEvent("Server.Bank.UpdateSolde", 3, amount, uuid);
        }
    });

    
    atmMenu.MenuOpen.on(() => zFramework.LocalPlayer.blockInput = true);
    atmMenu.MenuClose.on(() => zFramework.LocalPlayer.blockInput = false);
}

zFramework.Core.Bank.SetSolde = () => atmMenu.SubTitle = `Solde: ~b~$${zFramework.LocalPlayer.bank}~w~`;

zFramework.Core.Bank.OpenATM = async cb => {
    if (cb.owner.uuid != zFramework.LocalPlayer.UUID) return zFramework.Functions.Notify("~r~Vous n'êtes pas propriétaire de la carte.");

    const pin = await zFramework.Functions.KeyboardInput(`Entrez le PIN de la carte`, "", 4);
    if (!pin || pin !== cb.card.pin) return zFramework.Functions.Notify("~r~Le code PIN est incorrect.");
    if (cb.blocked) return zFramework.Functions.Notify("~r~Cette carte est inutilisable car elle à été bloqué par son propriétaire.");

    zFramework.Functions.Notify("~g~Code PIN bon !");

    atmMenu.Open();
}

zFramework.Core.Bank.IsNearATM = function(player) {
    for (const pos of this.ATMs) {
        if (zFramework.Functions.GetDistanceByCoords(player.getLocation(), pos) <= 2.5)
            return true;
    }

    return false;
}

zFramework.Core.Bank.Initialize = function() {
    for (const [county, npc] of Object.entries(this.NPCs)) {
        const { model, pos, name } = npc;
        zFramework.Core.NPC.Register({ model, name, pos, text: [name] });
    }

    for (const pos of this.ATMs)
        new CBlip(pos, 434, 2, null, null, null, 5);

    this.FetchCBFromInv();
    registerCentralMenu();
    registerATMMenu();
}

zFramework.Core.Bank.Think = function() {
    for (const [county, npc] of Object.entries(this.NPCs)) {
        if (zFramework.Functions.GetDistanceByCoords(zFramework.LocalPlayer.getLocation(), npc.pos) <= 4.0) {
            zFramework.Functions.TopNotify("Appuyez sur ~INPUT_CONTEXT~ pour parler avec le banquier.");
            if (IsControlJustPressed(0, 51))
                this.OpenBank();
        }
    }
}