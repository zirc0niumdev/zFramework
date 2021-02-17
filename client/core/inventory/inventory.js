function inventoryAction(action, name, amount = 1) {
    const item = zFramework.Items.GetItem(name);
    if (!item) return;
    console.log("tesaat");

    const playerPed = zFramework.LocalPlayer.pedId;
    const playerVehicle = zFramework.LocalPlayer.isInVehicle();
    if (playerVehicle && GetPedInVehicleSeat(playerVehicle, -1) == playerPed && GetEntitySpeed(playerVehicle) > 3) return;
    console.log("tesaaat");

    if (action == 1) {
        console.log("tesaaaaaaat");
        console.log(zFramework.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, name, "items"));
        if (zFramework.Inventory.GetItemAmount(zFramework.LocalPlayer.inventory, name) < amount)
            return zFramework.Functions.Notify(`~r~Vous n'avez pas suffisamment de ${name}.`);

        console.log("tesaaaat");

        const useFunc = GetUseItemFromName(item.onUse);
        useFunc(zFramework.LocalPlayer, amount, item);
        
        console.log("tesaaaaat");

        if (!item.keep && !item.onUse != "weapon")
            console.log("remove item");
    }
}

function changeWeaponSlot(slotName, weaponName) {

    if (!zFramework.Inventory.Opened) return;
    OpenInventory();
}

RegisterNuiCallbackType('inventoryInteraction');
on('__cfx_nui:inventoryInteraction', (data, cb) => {
    const { eventName, amount} = data;
    const { name } = data.itemData;

    if (eventName == "targetInventory" || eventName == "inventory" || !name) return;

    if (eventName == "weaponOne" || eventName == "weaponTwo" || eventName == "weaponThree")
        changeWeaponSlot(eventName == "weaponOne" && 1 || eventName && 2 || 3, name);
    else if (eventName == "useInventory")
        console.log("test");
        inventoryAction(1, name, parseInt(amount));

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
                weight: Math.round(weight),
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

zFramework.Inventory.Initialize = function() {
    for (d = 1; d <= 3; d++) {
        zFramework.Functions.RegisterControlKey(`wepBind${d}`, `Equiper votre arme dans le slot ${d}`, d.toString(), () => {
            if (UpdateOnscreenKeyboard() == 0 || zFramework.UI.KeepFocus) return;
            
            //XmVolesU(d);
        });
    }

    this.Tick();
}