zFramework.Core.Inventory.AddItem = function(name, num) {
    console.log(num);
    console.log(typeof(num));
    const { inventory } = zFramework.LocalPlayer;
    const itemTbl = inventory.items[name];
    const amount = typeof(num) == "object" && ((num.length > 1 || typeof(itemTbl) == "object") && num.length || num[0]) || num;

    if (typeof(num) == "number" && num > 0 && !zFramework.Core.Inventory.CanCarryItem(inventory, name, num, inventory.weight))
        return zFramework.Functions.Notify("~r~Vous n'avez pas suffisamment de place sur vous.");

        
    if ((typeof(num) == "object" || num < 0) && zFramework.Core.Inventory.GetItemAmount(inventory, name) - amount < 0)
        return zFramework.Functions.Notify(`~r~Vous n'avez pas suffisamment de ${name} sur vous.`);

    serverEvent("Server.Inventory.ManageItem", name, num);
}

zFramework.Core.Inventory.UpdateItem = function(name, num, data = {}) {
    const { items } = zFramework.LocalPlayer.inventory;
    if (!items[name]) return;

    items[name][num] = data;

    //serverEvent("Server.Inventory.UpdateItem", name, num, data);
}

function transferItem(item, amount, isDrop) {
    // if (amount < 1) return;
    // if (item.qty - amount < 0) return zFramework.Functions.Notify(`~r~Vous n'avez pas autant de ${item.base}.`);

    // if (isDrop)
    //     console.log("pickup hsit");
    // else {
    //     const closePly = zFramework.Functions.GetClosePlayer();

    //     if (closePly) serverEvent("Server.Inventory.TransferItem", GetPlayerServerId(closePly), item);
    //     else zFramework.Functions.Notify("~w~Rapprochez-vous.");
    // }
}

async function inventoryAction(action, it) {
    const playerPed = zFramework.LocalPlayer.pedId;
    const playerVehicle = zFramework.LocalPlayer.isInVehicle();
    if (playerVehicle && GetPedInVehicleSeat(playerVehicle, -1) == playerPed && GetEntitySpeed(playerVehicle) > 3) return;

    const item = zFramework.Core.Items.Get(it.name);
    const itemNum = it.itemKey[0];
    const itemData = zFramework.LocalPlayer.inventory.items[it.name][itemNum];

    if (action == 1) {
        if (!item.onUse) return;
        if (zFramework.Core.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, it.name) < it.amount) return zFramework.Functions.Notify(`~r~Vous n'avez pas suffisamment de ${item.name}.`);
        
        const useFunc = GetUseItemFromName(item.onUse);
        useFunc(zFramework.LocalPlayer, itemData, itemNum, it.amount, item);

        if (!item.keep && item.onUse != "weapon") zFramework.Core.Inventory.AddItem(it.name, [itemNum]);
    }
    // } else if (action == 2) transferItem({ name: it.name, index: it.index, data: it.data }, amount, false);
    // else if (action == 3) transferItem({ name: it.name, index: it.index, data: it.data, qty: invItem.qty }, amount, true);
    else if (action == 4) {
        if (it.name.includes("Argent")) return;
        const surname = await zFramework.Functions.KeyboardInput("Renommer", "", 20);
        itemData.name = surname;
        zFramework.Core.Inventory.UpdateItem(it.name, itemNum, itemData);
    } else if (action == 5) {
        
    }
}

function changeWeaponSlot(slotName, weaponName) {
    if (!zFramework.Functions.GetJsonConfig("weapons", weaponName)) return;

    for (const slot in zFramework.Core.Inventory.WeaponSlot) {
        if (zFramework.Core.Inventory.WeaponSlot[slot] != slotName && zFramework.LocalPlayer.inventory[zFramework.Core.Inventory.WeaponSlot[slot]] == weaponName)
            serverEvent("Server.Inventory.ChangeSlot", zFramework.Core.Inventory.WeaponSlot[slot], zFramework.LocalPlayer.inventory[slotName]);
    }

    serverEvent("Server.Inventory.ChangeSlot", slotName, weaponName);
}

RegisterNuiCallbackType('inventoryInteraction');
on('__cfx_nui:inventoryInteraction', (data, cb) => {
    const { eventName } = data;
    const amount = parseInt(data.amount);
    
    const name = data.itemData.base || data.itemData.name;
    const itemKey = data.itemData.itemKey || [0];

    if (eventName == "targetInventory" || eventName == "inventory" || !name) return;

    if (eventName == "weaponOne" || eventName == "weaponTwo" || eventName == "weaponThree") changeWeaponSlot(eventName, name);
    else if (eventName == "useInventory") inventoryAction(1,  { name, itemKey, amount });
    // else if (eventName == "giveInventory") inventoryAction(2, { name, itemKey, amount });
    // else if (eventName == "throwInventory") inventoryAction(3, { name, itemKey, amount });
    // else if (eventName == "infoInventory") inventoryAction(5, { name, itemKey, amount });
    else if (eventName == "renameInventory") inventoryAction(4, { name, itemKey, amount });

    cb("ok");
});

zFramework.Core.Inventory.OnUpdated = function() {
    if (!this.Opened) return;

    openInventory();
}

function formatInventoryForNUI(inv, money, dirtyMoney) {
    let items = [], clothes = [];

    for (const [itemName, itemTbl] of Object.entries(inv)) {
        let itemsTbl = { 0: { keys: [] } };
    
        // TODO: check clothes

        if (typeof(itemTbl) == "object") {
            for (const [itemIndex, itemData] of Object.entries(itemTbl)) {
                let added = false;

                if (itemData.name && itemData.name.length > 0) {
                    if (!itemsTbl[itemData.name]) itemsTbl[itemData.name] = { name: itemData.name, keys: [] };

                    itemsTbl[itemData.name].keys.push(itemIndex);

                    added = true;
                } else {
                    for (const [keyData, _] of Object.entries(itemData)) {
                        const prefix = keyData == "uid" && itemData[keyData];
                        if (prefix) {
                            if (!itemsTbl[prefix]) itemsTbl[prefix] = { keys: [] };

                            itemsTbl[prefix].keys.push(itemIndex);
                            added = true;

                            break;
                        }
                    }
                }

                if (!added) itemsTbl[0].keys.push(itemIndex);
            }

            for (const [itemIndex, itemData] of Object.entries(itemsTbl)) {
                if (itemData.keys.length > 0) {
                    if (!isNaN(itemIndex)) itemIndex = Number(itemIndex);
                    items.push({
                        name: itemData.name && itemIndex || itemName,
                        base: itemData.name && itemName || null,
                        qty: itemData.keys.length,
                        itemKey: itemData.keys,
                        suffix: !itemData.name && typeof(itemIndex) === "string" && itemIndex || null
                    });
                }
            }
        }
    }
  
    if (money && money > 0) items.push({ name: "Argent", qty: money, money: true });
    if (dirtyMoney && dirtyMoney > 0) items.push({ name: "Argent sale", dirtyMoney: money, dirtyMoney: true });

    return { inv: items, clothes };
}

function openInventory() {
    SetNuiFocus(true, true);
    zFramework.Functions.SetKeepInputMode(true);

    const { items, weight, weaponOne, weaponTwo, weaponThree } = zFramework.LocalPlayer.inventory;
    const { inv, clothes } = formatInventoryForNUI(items, zFramework.LocalPlayer.money, zFramework.LocalPlayer.dirtyMoney);

    zFramework.Functions.SendToNUI(
        {
            eventName: "showInventory",
            eventData: {
                items: inv,
                clothes: clothes,
                weight: weight.toFixed(2),
                weaponOne,
                weaponTwo,
                weaponThree
            }
        }
    );
}

function closeInventory() {
    zFramework.Core.Inventory.Opened = false;
    SetNuiFocus(false, false);
    zFramework.Functions.SendToNUI({ eventName: "hideInventory" });
    Wait(50);
}

RegisterNuiCallbackType('hideInventory');
on('__cfx_nui:hideInventory', (data, cb) => {
    SetNuiFocus(false, false);
    zFramework.Functions.SetKeepInputMode(false);
    zFramework.Core.Inventory.Opened = false;

    cb("ok");
});

zFramework.Functions.RegisterControlKey("openInventory", "Ouvrir/Fermer l'inventaire", "TAB", () => {
    if (zFramework.Core.Inventory.Opened && zFramework.UI.KeepFocus) return closeInventory();

    zFramework.Core.Inventory.Opened = true;
    openInventory();
});

zFramework.Core.Inventory.Think = function() {
    HudWeaponWheelIgnoreSelection();
    DisableControlAction(0, 37, true);
        
    if (zFramework.Core.Inventory.Opened) {
        DisableControlAction(0, 24, true);
        DisableControlAction(0, 25, true);
        for (let i = 0; i < 6; i++) DisableControlAction(0, i, true);
        HideHudAndRadarThisFrame();
    }
}

zFramework.Core.Inventory.Thread = function() {
    const defaultWeap = GetHashKey("WEAPON_UNARMED");
    const ammoConfig = zFramework.Functions.GetJsonConfig("ammo");
    const weaponsConfig = zFramework.Functions.GetJsonConfig("weapons");

    setInterval(() => {
        const selectedWeapon = GetSelectedPedWeapon(zFramework.LocalPlayer.pedId);
        if (selectedWeapon && selectedWeapon != defaultWeap) {
            let currentWeapon;
            for (const [weaponName, weaponHash] of Object.entries(weaponsConfig)) if (GetHashKey(weaponHash) == selectedWeapon)currentWeapon = weaponName;
            
            if (!zFramework.LocalPlayer.inventory.items[currentWeapon])
                RemoveWeaponFromPed(zFramework.LocalPlayer.pedId, selectedWeapon);
            else {
                const ammo = ammoConfig[currentWeapon];
                if (!ammo) return;
                const itemAmount = zFramework.Core.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, ammo);
                const ammoCount = itemAmount && (GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon) != itemAmount && GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon) > itemAmount && itemAmount || GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon) || 0);

                SetPedAmmo(zFramework.LocalPlayer.pedId, selectedWeapon, ammoCount);
                if (itemAmount && itemAmount != GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon)) zFramework.Core.Inventory.AddItem(ammo, [1]);
            }
        }
    }, 150);
}

function takeWeapon(slot) {
    const weapon = zFramework.LocalPlayer.inventory[zFramework.Core.Inventory.WeaponSlot[slot]];
    if (weapon && zFramework.Functions.GetJsonConfig("weapons", weapon) && zFramework.LocalPlayer.inventory.items[weapon]) inventoryAction(1, { name: weapon, itemKey: [0], amount: 1 });
}

zFramework.Core.Inventory.Initialize = function() {
    for (let d = 1; d < 4; d++) {
        zFramework.Functions.RegisterControlKey(`wepBind${d}`, `Equiper votre arme dans le slot ${d}`, d.toString(), () => {
            if (UpdateOnscreenKeyboard() == 0 || zFramework.UI.KeepFocus) return;
            takeWeapon(d);
        });
    }

    this.Thread();
}