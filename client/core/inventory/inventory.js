const weaponSlot = { 1: "weaponOne", 2: "weaponTwo", 3: "weaponThree" };

function inventoryAction(action, name, amount = 1) {
    const item = zFramework.Core.Items.GetItem(name);
    if (!item) return;

    const playerPed = zFramework.LocalPlayer.pedId;
    const playerVehicle = zFramework.LocalPlayer.isInVehicle();
    if (playerVehicle && GetPedInVehicleSeat(playerVehicle, -1) == playerPed && GetEntitySpeed(playerVehicle) > 3) return;
    
    if (action == 1) {
        if (!item.onUse) return;
        if (zFramework.Core.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, name) < amount) return zFramework.Functions.Notify(`~r~Vous n'avez pas suffisamment de ${name}.`);
        
        const useFunc = GetUseItemFromName(item.onUse);
        useFunc(zFramework.LocalPlayer, amount, item);

        if (!item.keep && item.onUse != "weapon") serverEvent("Server.Inventory.DeleteItem", item.name, amount);
    } else if (action == 2) {

    } else if (action == 3) {
        
    } else if (action == 4) {
        
    }
}

function changeWeaponSlot(slotName, weaponName) {
    if (!zFramework.Functions.GetJsonConfig("weapons", weaponName)) return;
    
    for (const slot in weaponSlot) {
        if (weaponSlot[slot] != slotName)
            if (zFramework.LocalPlayer.inventory[weaponSlot[slot]] == weaponName) zFramework.LocalPlayer.inventory[weaponSlot[slot]] = zFramework.LocalPlayer.inventory[slotName];
    }

    zFramework.LocalPlayer.inventory[slotName] = weaponName;

    if (!zFramework.Core.Inventory.Opened) return;
    openInventory();
}

RegisterNuiCallbackType('inventoryInteraction');
on('__cfx_nui:inventoryInteraction', (data, cb) => {
    const { eventName, amount } = data;
    const { name } = data.itemData;

    if (eventName == "targetInventory" || eventName == "inventory" || !name) return;

    if (eventName == "weaponOne" || eventName == "weaponTwo" || eventName == "weaponThree") changeWeaponSlot(eventName, name);
    else if (eventName == "useInventory") inventoryAction(1, name, parseInt(amount));
    else if (eventName == "useInventory") inventoryAction(1, name, parseInt(amount));

    cb("ok");
});

zFramework.Core.Inventory.OnUpdated = function() {
    if (!this.Opened) return;

    openInventory();
}

function openInventory() {
    SetNuiFocus(true, true);
    zFramework.Functions.SetKeepInputMode(true);
    const { items, clothes, weight, weaponOne, weaponTwo, weaponThree } = zFramework.LocalPlayer.inventory;
    
    zFramework.Functions.SendToNUI(
        {
            eventName: "showInventory",
            eventData: {
                items,
                clothes,
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
    if (weapon && zFramework.Functions.GetJsonConfig("weapons", weapon)) {
        if (zFramework.Core.Inventory.HasItem(zFramework.LocalPlayer.inventory, weapon)) inventoryAction(1, weapon, 1);
    }
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