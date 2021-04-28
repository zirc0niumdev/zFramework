let onUseFunc = {};

onUseFunc["weapon"] = async (localPlayer, data, num, amount, item) => {
    if (localPlayer.isInVehicle()) return zFramework.Functions.Notify("Vous êtes dans l'incapacité d'utiliser une arme.");
    
    const weapon = zFramework.Functions.GetJsonConfig("weapons", item.name);
    if (!weapon) return zFramework.Functions.Notify("~r~Veuillez signaler cette arme à un admin, elle ne fonctionne pas.");

    const isArmed = IsPedArmed(localPlayer.pedId, 7);
    RemoveAllPedWeapons(localPlayer.pedId, false);
    if (isArmed) return zFramework.Functions.Notify(`Vous avez déséquipé votre ~r~${item.name}~w~.`);

    const ammo = zFramework.Functions.GetJsonConfig("ammo", item.name);
    const ammoAmount = ammo && zFramework.Core.Inventory.GetItemAmount(localPlayer.inventory, ammo) || 200;
    GiveWeaponToPed(localPlayer.pedId, weapon, parseInt(ammoAmount) || 0, true, true);
    await Delay(10);
    zFramework.Functions.Notify(`Vous avez équipé votre ~g~${item.name}~w~.`);
    // send /me
}

onUseFunc["eatItem"] = (localPlayer, data, num, amount, item) => zFramework.Core.Needs.Eat(item, item.name);

onUseFunc["drinkItem"] = (localPlayer, data, num, amount, item) => zFramework.Core.Needs.Eat(item, item.name);

onUseFunc["idItem"] = (localPlayer, data, num, amount, item) => {
    const closestPlayer = zFramework.Functions.GetClosestPlayer();
    serverEvent("Server.AskId", closestPlayer && GetPlayerServerId(closestPlayer) || false, item.name, num);
};

onUseFunc["cbItem"] = (localPlayer, data, num, amount, item) => {
    if (zFramework.Core.Bank.IsNearATM(localPlayer))
        zFramework.Core.Bank.OpenATM(data);
};

onUseFunc["clothItem"] = (localPlayer, data, num, amount, item) => {
    const playerSex = localPlayer.sex;
    if ((data.s && data.s != playerSex) || playerSex > 1) return zFramework.Functions.Notify("~r~Impossible.~w~\nVous n'avez pas la carrure.");
    
    data = { 3: [14], 8: [7], 11: [144] }; // temp

    let enfiled;
    for (let c=0; c <= 12; c++) {
        if (data[c] && zFramework.Core.Cloth.GetDefaultClothForComponent(c, playerSex) && c != 2) {
            enfiled = c == 12 && localPlayer.skin.clothes[12] && localPlayer.skin.clothes[12][1] == data[c][1] ||
                GetPedDrawableVariation(localPlayer.pedId, c) == data[c][0];
            if (enfiled == false) {
                enfiled = false;
                break;
            }
        }
    }
    zFramework.Core.Cloth.PlayClothAnim(localPlayer.pedId, item.name, enfiled, data);
    for (let i=0; i <= 12; i++) {
        const defaultCloth = zFramework.Core.Cloth.GetDefaultClothForComponentWithTexture(i, playerSex);
        if (data[i] && defaultCloth && i != 2) {
            const cloth = !enfiled && data[i][0] || defaultCloth[0], color = !enfiled && data[i][1] || defaultCloth[1];
            zFramework.LocalPlayer.skin.clothes[i] = [cloth, color];

            if (i != 12) zFramework.Core.Cloth.SetSkin({c: {[i]: [cloth, color]}});
            else {
                // set decorations props
            }
        }
    }
    // serverEvent("Server.Items.UseCloth", item.name, num, zFramework.LocalPlayer.skin.clothes);
};

global.GetUseItemFromName = _ => onUseFunc[_];
