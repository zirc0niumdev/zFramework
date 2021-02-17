zFramework.Inventory = {};
zFramework.Inventory.Opened = false;

zFramework.Inventory.HasItem = function(inv, name, type = "items") {
    if (!zFramework.Items.IsValid(name));

    return inv[type].findIndex(item => item.name === name) > -1 || false;
}

zFramework.Inventory.GetItem = function(inv, name, type = "items") {
    const item = this.HasItem(inv, name, type);
    if (!item) return;

    return inv[type][item];
}

zFramework.Inventory.GetItemAmount = function(inv, name, type = "items") {
    const item = this.GetItem(inv, name, type);
    if (!item) return;

    return item.qty;
}