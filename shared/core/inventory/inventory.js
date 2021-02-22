zFramework.Core.Inventory = {};
zFramework.Core.Inventory.Opened = false;
zFramework.Core.Inventory.DefaultWeight = 1.0;
zFramework.Core.Inventory.PlayerWeight = 45.0;
zFramework.Core.Inventory.WeaponSlot = { 1: "weaponOne", 2: "weaponTwo", 3: "weaponThree" };
zFramework.Core.Inventory.ClothesItems = ["Vêtement", "Sac", "Tenue", "Accessoire", "Masque", "Kevlar", "Sac", "Tenue LSPD", "Tenue LSPD"];

zFramework.Core.Inventory.GetWeight = inv => inv.weight;

zFramework.Core.Inventory.CanCarryItem = function(inv, name, qty, plyWeight, next) {
    const result = (zFramework.Core.Items.Get(name).weight || this.DefaultWeight) * qty + this.GetWeight(inv) <= plyWeight;
    if (next) next(result);

    return result;
}

zFramework.Core.Inventory.GetItemAmount = (inv, name) => inv && inv[name] && (typeof(inv[name]) == "array" && inv[name].length || inv[name]) || 0;