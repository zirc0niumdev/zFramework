import * as NativeUI from "../../class/menu/nativeui.js";

let timer = 0, time = 60 * 1000* 5;

const nonFatalWeapons = [
    -1569615261,
    -1600701090,
    126349499,
    4194021054,
    -100946242
];

zFramework.Core.LSMS.OnEntityDamage = function(victim, instigator, isFatal, weaponHash) {
    const { pedId } = zFramework.LocalPlayer;
    if (pedId != victim) return;

    const shouldKO = isFatal != 0 && (IsPedArmed(instigator, 1) || nonFatalWeapons.find(weapon => weapon == weaponHash))
    TriggerEvent(shouldKO && "EntityKO" || isFatal != 0 && "EntityDeath" || "EntityTakeDamage", victim, instigator, weaponHash);
}

zFramework.Core.LSMS.PostRevive = function() {
    
}

zFramework.Core.LSMS.Revive = function() {
    const { pedId, getLocation } = zFramework.LocalPlayer;
    NetworkResurrectLocalPlayer(getLocation().x, getLocation().y, getLocation().z, GetEntityHeading(pedId), false, false);
    setTimeout(() => {
        const newPed = GetPlayerPed(-1);
        if (pedId != newPed) DeleteEntity(pedId);
    }, 100);
    zFramework.LocalPlayer.invincible = true;
    SetEntityHealth(PlayerPedId(), 125);
    zFramework.LocalPlayer.pedId = PlayerPedId();
}

on("EntityDeath", (victim, instigator, weapon) => {
    const { ko, dead } = zFramework.LocalPlayer;
    if (victim && !ko && IsEntityDead(victim)) {
        zFramework.Core.LSMS.Revive();
        zFramework.LocalPlayer.ragdoll = true;
        zFramework.LocalPlayer.invincible = true;

        if (!dead) {
            serverEvent("Server.SetDead", true);
            zFramework.Functions.Notify("~r~COMA~w~\nVoulez-vous contacter une ambulance ?");
            zFramework.Functions.Notify("Appeler: ~g~E~w~ ou ~r~Y");
            DecorSetBool(GetPlayerPed(-1), "Player_Dead", true);
            ShakeGameplayCam("DEATH_FAIL_IN_EFFECT_SHAKE", 1.0);
            SetTimecycleModifier("rply_vignette");
            zFramework.Core.HUD.AddTimerBar("TEMPS RESTANT", { endTime: GetGameTimer() + time });
        }

        victim = GetPlayerPed(-1);
        SetPedToRagdoll(victim, 1000, 1000, 0, 1, 1, 0);
    }
});

RegisterCommand("revive", () => zFramework.Core.LSMS.Revive());

const emsMenu = new NativeUI.Menu("EMS", "Menu métier", new NativeUI.Point(50, 50));
function registerJobMenu() {
    const animItem = new NativeUI.UIMenuItem("Animations");
    const actionItem = new NativeUI.UIMenuItem("Actions");
    const objectItem = new NativeUI.UIMenuItem("Objets");
    const civItem = new NativeUI.UIMenuItem("Civière");
    const factureItem = new NativeUI.UIMenuItem("Facture");
    emsMenu.AddItems([animItem, actionItem, objectItem, civItem, factureItem]);

    const animMenu = new NativeUI.Menu("Animations", "Menu métier", new NativeUI.Point(50, 50));
    const stopItem = new NativeUI.UIMenuItem("~r~Arrêter");
    const ausAnimItem = new NativeUI.UIMenuItem("Ausculter", "", "", { anim: "CODE_HUMAN_MEDIC_KNEEL" });
    const masAnimItem = new NativeUI.UIMenuItem("Massage Cardiaque", "", "", { anim: "CODE_HUMAN_MEDIC_TEND_TO_DEAD" });
    const noteAnimItem = new NativeUI.UIMenuItem("Prendre des notes", "", "", { anim: "CODE_HUMAN_MEDIC_TIME_OF_DEATH" });
    const photoAnimItem = new NativeUI.UIMenuItem("Prendre des photos", "", "", { anim: "WORLD_HUMAN_PAPARAZZI" });
    emsMenu.AddSubMenu(animMenu, animItem);
    animMenu.AddItems([stopItem, ausAnimItem, masAnimItem, noteAnimItem, photoAnimItem]);

    animMenu.ItemSelect.on(async (item, index) => {
        if (item == stopItem) ClearPedTasks(zFramework.LocalPlayer.pedId);
        else zFramework.Functions.PlayAnim(item.Data.anim);
    });

    const actionMenu = new NativeUI.Menu("Actions", "Menu métier", new NativeUI.Point(50, 50));
    const reviveItem = new NativeUI.UIMenuItem("Réanimation");
    const healItem = new NativeUI.UIMenuItem("Soigner");
    emsMenu.AddSubMenu(actionMenu, actionItem);
    actionMenu.AddItems([reviveItem, healItem]);

    actionMenu.ItemSelect.on(async (item, index) => {
        const targetId = zFramework.Functions.GetClosestPlayer();
        if (item == reviveItem) zFramework.Core.LSMS.Revive(targetId);
        else if (item == healItem) zFramework.Core.LSMS.Heal(targetId, 200);
    });
}

zFramework.Core.LSMS.OpenMenu = function() {
    if (emsMenu.Visible) return emsMenu.Close();
    emsMenu.Open();
}

zFramework.Core.LSMS.Initialize = function() {
    registerJobMenu();
    zFramework.Core.Job.RegisterMenu(2, zFramework.Core.LSMS.OpenMenu, true, true);
    DecorRegister("Player_Dead", 2);
}