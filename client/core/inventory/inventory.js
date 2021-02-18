const weaponSlot = { 1: "weaponOne", 2: "weaponTwo", 3: "weaponThree" };

function inventoryAction(action, name, amount = 1) {
    const item = zFramework.Items.GetItem(name);
    if (!item) return;

    const playerPed = zFramework.LocalPlayer.pedId;
    const playerVehicle = zFramework.LocalPlayer.isInVehicle();
    if (playerVehicle && GetPedInVehicleSeat(playerVehicle, -1) == playerPed && GetEntitySpeed(playerVehicle) > 3) return;
    
    if (action == 1) {
        if (!item.onUse) return;
        if (zFramework.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, name) < amount) return zFramework.Functions.Notify(`~r~Vous n'avez pas suffisamment de ${name}.`);
        
        const useFunc = GetUseItemFromName(item.onUse);
        useFunc(zFramework.LocalPlayer, amount, item);

        if (!item.keep && item.onUse != "weapon") serverEvent("Server.DeleteItem", item.name, amount);
    } else if (action == 2) {

    } else if (action == 3) {
        
    } else if (action == 4) {
        
    }
}

function changeWeaponSlot(slotName, previousSlotName, weaponName) {
    if (!zFramework.Functions.GetJsonConfig("weapons", weaponName)) return;
    
    if (previousSlotName == "weaponOne" || previousSlotName == "weaponTwo" || previousSlotName == "weaponThree") zFramework.LocalPlayer.inventory[previousSlotName] = "";
    if (slotName != "inventory") zFramework.LocalPlayer.inventory[slotName] = weaponName;

    if (!zFramework.Inventory.Opened) return;
    OpenInventory();
}

RegisterNuiCallbackType('inventoryInteraction');
on('__cfx_nui:inventoryInteraction', (data, cb) => {
    const { eventName, previousEvent, amount } = data;
    const { name } = data.itemData;

    if (eventName == "targetInventory" || !name) return;

    if (eventName == "weaponOne" || eventName == "weaponTwo" || eventName == "weaponThree" || eventName == "inventory") changeWeaponSlot(eventName, previousEvent, name);
    else if (eventName == "useInventory") inventoryAction(1, name, parseInt(amount));

    cb("ok");
});

zFramework.Inventory.OnInventoryUpdated = function() {
    if (!this.Opened) return;

    OpenInventory();
}

function OpenInventory() {
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

function CloseInventory() {
    zFramework.Inventory.Opened = false;
    SetNuiFocus(false, false);
    zFramework.Functions.SendToNUI({ eventName: "hideInventory" });
    Wait(50);
}

RegisterNuiCallbackType('hideInventory');
on('__cfx_nui:hideInventory', (data, cb) => {
    SetNuiFocus(false, false);
    zFramework.Functions.SetKeepInputMode(false);
    zFramework.Inventory.Opened = false;

    cb("ok");
});

zFramework.Functions.RegisterControlKey("openInventory", "Ouvrir/Fermer l'inventaire", "TAB", () => {
    if (!zFramework.Inventory.Opened && !zFramework.UI.KeepFocus) {
        zFramework.Inventory.Opened = true;
        OpenInventory();
    } else {
        CloseInventory();
    }
});

zFramework.Inventory.Tick = function() {
    const defaultWeap = GetHashKey("WEAPON_UNARMED");

    // TODO
    // setInterval(() => {
    //     const selectedWeapon = GetSelectedPedWeapon(zFramework.LocalPlayer.pedId);
    //     if (selectedWeapon && selectedWeapon != defaultWeap) {
    //         // let currentWeapon;
    //         // for (;;) {
    //         //     if (GetHashKey(;) == selectedWeapon) {
    //         //         currentWeapon = ;;
    //         //     }
    //         // }
    //         // if (!zFramework.LocalPlayer.inventory[o]) {
    //         //     RemoveWeaponFromPed(zFramework.LocalPlayer.pedId, selectedWeapon);
    //         // }
    //     }
    // }, 150);

    setTick(() => {
        HudWeaponWheelIgnoreSelection();
        DisableControlAction(0, 37, true);
        
        if (zFramework.Inventory.Opened) {
            DisableControlAction(0, 24, true);
            DisableControlAction(0, 25, true);
            for (let i = 0; i <= 6; i++) DisableControlAction(0, i, true);
            HideHudAndRadarThisFrame();
        }
    });
}

function takeWeapon(slot) {
    const weapon = zFramework.LocalPlayer.inventory[weaponSlot[slot]];
    if (weapon && zFramework.Functions.GetJsonConfig("weapons", weapon)) {
        if (zFramework.Inventory.HasItem(zFramework.LocalPlayer.inventory, weapon)) inventoryAction(1, weapon, 1);
    }
}

zFramework.Inventory.Initialize = function() {
    for (let d = 1; d < 4; d++) {
        zFramework.Functions.RegisterControlKey(`wepBind${d}`, `Equiper votre arme dans le slot ${d}`, d.toString(), () => {
            if (UpdateOnscreenKeyboard() == 0 || zFramework.UI.KeepFocus) return;
            takeWeapon(d);
        });
    }

    this.Tick();
}