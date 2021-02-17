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

RegisterNuiCallbackType('hideInventory'); // register the type

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