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
    // Register Control Key ?

    this.Tick();
}