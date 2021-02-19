zFramework.Core.Inventory = {};
zFramework.Core.Inventory.Opened = false;
zFramework.Core.Inventory.PlayerWeight = 45.0;

zFramework.Core.Inventory.HasItem = (inv, name, type = "items") => inv[type].find(it => it.name === name) && true || false;

zFramework.Core.Inventory.FindItem = (inv, name, type = "items") => {
    if (!zFramework.Core.Items.IsValid(name));

    return inv[type].findIndex(it => it.name === name);
}

zFramework.Core.Inventory.GetItem = function(inv, name) {
    if (!zFramework.Core.Items.IsValid(name));

    const { type } = zFramework.Core.Items.GetItem(name);
    const invItem = this.HasItem(inv, name, type);
    if (!invItem) return;

    return inv[type][invItem];
}

zFramework.Core.Inventory.GetItemAmount = function(inv, name) {
    const item = this.GetItem(inv, name);
    if (!item) return;
    
    return item.qty;
}