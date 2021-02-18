zFramework.Inventory = {};
zFramework.Inventory.Opened = false;
zFramework.Inventory.PlayerWeight = 45.0;

zFramework.Inventory.HasItem = (inv, name, type = "items") => inv[type].find(it => it.name === name) && true || false;

zFramework.Inventory.FindItem = (inv, name, type = "items") => {
    if (!zFramework.Items.IsValid(name));

    return inv[type].findIndex(it => it.name === name);
}

zFramework.Inventory.GetItem = function(inv, name) {
    if (!zFramework.Items.IsValid(name));

    const { type } = zFramework.Items.GetItem(name);
    const invItem = this.HasItem(inv, name, type);
    if (!invItem) return;

    return inv[type][invItem];
}

zFramework.Inventory.GetItemAmount = function(inv, name) {
    const item = this.GetItem(inv, name);
    if (!item) return;
    
    return item.qty;
}