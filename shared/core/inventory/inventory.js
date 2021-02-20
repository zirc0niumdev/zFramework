zFramework.Core.Inventory = {};
zFramework.Core.Inventory.Opened = false;
zFramework.Core.Inventory.PlayerWeight = 45.0;
zFramework.Core.Inventory.WeaponSlot = { 1: "weaponOne", 2: "weaponTwo", 3: "weaponThree" };

zFramework.Core.Inventory.HasItem = (inv, name, type = "items") => inv[type].find(it => it.name === name || it.data.surname === name) && true || false;

zFramework.Core.Inventory.FindItem = (inv, name, type = "items") => {
    if (!zFramework.Core.Items.IsValid(name));

    return inv[type].findIndex(it => it.name === name || it.data.surname === name);
}

zFramework.Core.Inventory.FindItemInSlot = function(inv, name) {
    if (!zFramework.Core.Items.IsValid(name));
    
    for (const slot in this.WeaponSlot)
        if (inv[this.WeaponSlot[slot]] == name)
            return this.WeaponSlot[slot];
}

zFramework.Core.Inventory.GetItem = function(inv, name) {
    if (!zFramework.Core.Items.IsValid(name));

    const { type } = zFramework.Core.Items.GetItem(name);
    if (!type) return;
    if (!this.HasItem(inv, name, type)) return;
    const invItem = this.FindItem(inv, name, type);
    if (!invItem) return;

    return inv[type][invItem];
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