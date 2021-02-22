zFramework.Core.Inventory = {};
zFramework.Core.Inventory.Opened = false;
zFramework.Core.Inventory.DefaultWeight = 1.0;
zFramework.Core.Inventory.PlayerWeight = 45.0;
zFramework.Core.Inventory.WeaponSlot = { 1: "weaponOne", 2: "weaponTwo", 3: "weaponThree" };
zFramework.Core.Inventory.ClothesItems = ["Vêtement", "Sac", "Tenue", "Accessoire", "Masque", "Kevlar", "Sac", "Tenue LSPD", "Tenue LSPD"];

zFramework.Core.Inventory.GetWeight = inv => inv.weight;

zFramework.Core.Inventory.GetItemInSlot = function(inv, name) {
    for (const slot in this.WeaponSlot)
        if (inv[this.WeaponSlot[slot]] == name)
            return this.WeaponSlot[slot];
}

zFramework.Core.Inventory.CanCarryItem = function(inv, name, qty, plyWeight, next) {
    const result = (zFramework.Core.Items.Get(name).weight || this.DefaultWeight) * qty + this.GetWeight(inv) <= plyWeight;
    if (next) next(result);

    return result;
}

zFramework.Core.Inventory.GetItemAmount = (inv, name) => inv.items && inv.items[name] && (typeof(inv.items[name]) == "object" && inv.items[name].length || inv.items[name]) || 0;