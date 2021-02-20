let onUseFunc = {};

onUseFunc["test"] = () => {
    zFramework.Functions.Notify("Test");
}

onUseFunc["weapon"] = (localPlayer, item, index, amount) => {
    if (localPlayer.isInVehicle()) return zFramework.Functions.Notify("Vous êtes dans l'incapacité d'utiliser une arme.");
    const weapon = zFramework.Functions.GetJsonConfig("weapons", item.name);
    if (!weapon) return zFramework.Functions.Notify("~r~Veuillez signaler cette arme à un admin, elle ne fonctionne pas.");

    const isArmed = IsPedArmed(localPlayer.pedId, 7);
    RemoveAllPedWeapons(localPlayer.pedId, false);
    if (isArmed) return zFramework.Functions.Notify(`Vous avez déséquipé votre ~r~${item.name}~w~.`);

    const ammo = zFramework.Functions.GetJsonConfig("ammo", item.name);
    const ammoAmount = ammo && zFramework.Core.Inventory.GetItemAmount(localPlayer.inventory, item.name) || 200;
    GiveWeaponToPed(localPlayer.pedId, weapon, parseInt(ammoAmount) || 0, true, true);
    Wait(10);
    zFramework.Functions.Notify(`Vous avez équipé votre ~g~${item.name}~w~.`);
    // send /me
}

GetUseItemFromName = _ => onUseFunc[_];
