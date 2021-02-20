const weaponSlot = zFramework.Core.Inventory.WeaponSlot;

function transferItem(name, amount, isDrop) {
    if (zFramework.Core.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, name) - amount < 0) return zFramework.Functions.Notify("~r~Vous n'avez pas autant d'objets.");


}

async function inventoryAction(action, name, index, amount = 1) {
    const playerPed = zFramework.LocalPlayer.pedId;
    const playerVehicle = zFramework.LocalPlayer.isInVehicle();
    if (playerVehicle && GetPedInVehicleSeat(playerVehicle, -1) == playerPed && GetEntitySpeed(playerVehicle) > 3) return;
    
    const item = zFramework.Core.Items.GetItem(name);
    if (!item) return;

    if (action == 1) {
        const invItem = zFramework.Core.Inventory.GetItem(zFramework.LocalPlayer.inventory, name);
        if (!item.onUse) return;
        console.log(name);
        console.log(invItem);
        if (invItem.qty < amount) return zFramework.Functions.Notify(`~r~Vous n'avez pas suffisamment de ${invItem.name}.`);
        
        const useFunc = GetUseItemFromName(item.onUse);
        useFunc(zFramework.LocalPlayer, item, index, amount);

        if (!item.keep && item.onUse != "weapon") serverEvent("Server.Inventory.DeleteItem", item.name, amount, index);
    } else if (action == 2) transferItem(index, amount, false);
    else if (action == 3) transferItem(index, amount, true);
    else if (action == 4) {
        const surname = await zFramework.Functions.KeyboardInput("Surnom", "", 20);
        serverEvent('Server.Inventory.UpdateItem', index, item.type, "base", surname);
    } else if (action == 5) {
        
    }
}

function changeWeaponSlot(slotName, weaponName) {
    if (!zFramework.Functions.GetJsonConfig("weapons", weaponName)) return;

    for (const slot in weaponSlot) {
        if (weaponSlot[slot] != slotName && zFramework.LocalPlayer.inventory[weaponSlot[slot]] == weaponName)
            serverEvent("Server.Inventory.ChangeSlot", weaponSlot[slot], zFramework.LocalPlayer.inventory[slotName]);
    }

    serverEvent("Server.Inventory.ChangeSlot", slotName, weaponName);
}

RegisterNuiCallbackType('inventoryInteraction');
on('__cfx_nui:inventoryInteraction', (data, cb) => {
    const { eventName, amount } = data;
    const { name, index } = data.itemData;

    if (eventName == "targetInventory" || eventName == "inventory" || !name) return;

    if (eventName == "weaponOne" || eventName == "weaponTwo" || eventName == "weaponThree") changeWeaponSlot(eventName, name);
    else if (eventName == "useInventory") inventoryAction(1, name, parseInt(index), parseInt(amount));
    else if (eventName == "giveInventory") inventoryAction(2, name, parseInt(index), parseInt(amount));
    else if (eventName == "throwInventory") inventoryAction(3, name, parseInt(index), parseInt(amount));
    else if (eventName == "infoInventory") {
        if (name.includes("Argent")) return;
        inventoryAction(5, name, parseInt(index));
    } else if (eventName == "renameInventory") {
        if (name.includes("Argent")) return;
        inventoryAction(4, name, parseInt(index));
    }

    cb("ok");
});

zFramework.Core.Inventory.OnUpdated = function() {
    if (!this.Opened) return;

    openInventory();
}

function formatInventoryForNUI(inv) {
    let items = [];
    let clothes = [];

    if (inv.items && inv.items !== []) {
        for (const [index, item] of Object.entries(inv.items))
            items[index] = { name: item.name, base: item.base, qty: item.qty, index, itemData: item.data };
    }

    if (inv.clothes && inv.clothes !== []) {
        for (const [index, item] of Object.entries(inv.clothes))
            clothes[index] = { name: item.name, base: item.base, qty: item.qty, index, itemData: item.data };
    }

    return { items, clothes };
}

function openInventory() {
    SetNuiFocus(true, true);
    zFramework.Functions.SetKeepInputMode(true);

    const { weight, weaponOne, weaponTwo, weaponThree } = zFramework.LocalPlayer.inventory;
    const inv = formatInventoryForNUI(zFramework.LocalPlayer.inventory);
    
    zFramework.Functions.SendToNUI(
        {
            eventName: "showInventory",
            eventData: {
                items: inv.items,
                clothes: inv.clothes,
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
            for (const [weaponName, weaponHash] of Object.entries(weaponsConfig)) if (GetHashKey(weaponHash) == selectedWeapon) currentWeapon = weaponName;
            if (!zFramework.Core.Inventory.HasItem(zFramework.LocalPlayer.inventory, currentWeapon)) RemoveWeaponFromPed(zFramework.LocalPlayer.pedId, selectedWeapon);
            else {
                const ammo = ammoConfig[currentWeapon]; if (!ammo) return;
                const itemAmount = zFramework.Core.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, ammo);
                const ammoCount = itemAmount && (GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon) != itemAmount && GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon) > itemAmount && itemAmount || GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon) || 0);

                SetPedAmmo(zFramework.LocalPlayer.pedId, selectedWeapon, ammoCount);
                if (itemAmount && itemAmount != GetAmmoInPedWeapon(zFramework.LocalPlayer.pedId, selectedWeapon)) serverEvent('Server.Inventory.DeleteItem', ammo, 1);
            }
        }
    }, 150);
}

function takeWeapon(slot) {
    const weapon = zFramework.LocalPlayer.inventory[weaponSlot[slot]];
    if (weapon && zFramework.Functions.GetJsonConfig("weapons", weapon) && zFramework.Core.Inventory.HasItem(zFramework.LocalPlayer.inventory, weapon))
        inventoryAction(1, weapon, 1);
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