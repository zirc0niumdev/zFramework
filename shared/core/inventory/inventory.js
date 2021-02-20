zFramework.Core.Inventory = {};
zFramework.Core.Inventory.Opened = false;
zFramework.Core.Inventory.PlayerWeight = 45.0;
zFramework.Core.Inventory.WeaponSlot = { 1: "weaponOne", 2: "weaponTwo", 3: "weaponThree" };

zFramework.Core.Inventory.HasItem = (inv, name, type = "items") => {
    if (typeof(name) == "string") return inv[type].find(it => it.name === name) && true || false;
    if (typeof(name) == "number") return inv[type][name] && true || false;
};

zFramework.Core.Inventory.GetItemIndex = (inv, name, type = "items") => {
    if (!zFramework.Core.Items.IsValid(name));

    return inv[type].findIndex(it => it.name === name);
}

zFramework.Core.Inventory.GetItemInSlot = function(inv, name) {
    if (!zFramework.Core.Items.IsValid(name));
    
    for (const slot in this.WeaponSlot)
        if (inv[this.WeaponSlot[slot]] == name)
            return this.WeaponSlot[slot];
}

zFramework.Core.Inventory.GetItem = function(inv, name) {
    if (!this.HasItem(inv, name, type)) return;

    const { type } = zFramework.Core.Items.GetItem(name);
    if (!type) return;
    const invItem = this.GetItemIndex(inv, name, type);
    if (!invItem) return;

    return inv[type][invItem];
}

zFramework.Core.Inventory.GetItemByIndex = function(inv, index, type) {
    if (!this.HasItem(inv, index, type)) return;

    return inv[type][index];
}

zFramework.Core.Inventory.GetItemName = function(inv, name) {
    const item = this.GetItem(inv, name);
    if (!item) return;

    return item.name;
}

zFramework.Core.Inventory.GetItemAmount = function(inv, name) {
    const item = this.GetItem(inv, name);
    if (!item) return;

    return item.qty;
}