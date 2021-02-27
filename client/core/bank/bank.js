import * as NativeUI from "../../class/menu/nativeui.js";

zFramework.Core.Bank.RegisterMenu = () => {
    console.log("teeeest");
    // Simple menu with default banner
    const menu = new NativeUI.Menu("Bank", "aaaaa", new NativeUI.Point(50, 50));
    const buyCardItem = new NativeUI.UIMenuItem("Acheter une carte bancaire", "aaaaaaaaa");
    const identityItem = new NativeUI.UIMenuItem("Sortir de l'argent", "aaaaaaaaa");
    const eeeeItem = new NativeUI.UIMenuItem("Mettre de l'argent", "aaaaaaaaa");
    const transfertItem = new NativeUI.UIMenuItem("Transfert", "aaaaaaaaa");

    menu.AddItems([buyCardItem, identityItem, eeeeItem, transfertItem]);

    RegisterCommand("bank", () => {
        menu.Open();
    })
}

zFramework.Core.Bank.Initialize = function() {
    for (const npc of this.NPCs) {
        const { model, pos, name } = npc;
        zFramework.NPC.Register({ model, name, pos, text: [name] });
    }

    this.RegisterMenu();
}