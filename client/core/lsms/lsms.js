import Vector3 from "../../../shared/class/CVector3.js";
import * as NativeUI from "../../class/menu/nativeui.js";

let deathTimer = 0;
let koTimer = 0;
const deathTime = 60 * 1000 * 5;
const koTime =  1000 * 30;

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

zFramework.Core.LSMS.HealPlayer = async function(targetId, amount) {
    if (!targetId) return;
    if (zFramework.Core.HUD.DoesAnyProgressBarExists()) return zFramework.Functions.Notify("~r~Vous êtes déjà entrain de réaliser quelque chose.");
    const { pedId } = zFramework.LocalPlayer;

    zFramework.LocalPlayer.busy = 1;
    zFramework.Core.HUD.CreateProgressBar("Application des soins", 10000);
    zFramework.Functions.ForceAnim(["CODE_HUMAN_MEDIC_KNEEL"]);
    await Delay(10000);
    ClearPedTasks(pedId);
    zFramework.LocalPlayer.busy = 0;
    serverEvent("Server.LSMS.Action", 2, {targetId: GetPlayerServerId(targetId), amount});
}

zFramework.Core.LSMS.RevivePlayer = async function(targetId) {
    targetId = targetId || zFramework.Functions.GetClosestPlayer(4.0, new Vector3(.0, .0, -1.0));
    if (!targetId) return;

    if (zFramework.Core.HUD.DoesAnyProgressBarExists()) return zFramework.Functions.Notify("~r~Vous êtes déjà entrain de réaliser quelque chose.");
    const { pedId } = zFramework.LocalPlayer;

    zFramework.Core.HUD.CreateProgressBar("Application des premiers soins", 10000);
    zFramework.Functions.PlayAnim(["missheistfbi3b_ig8_2", "cpr_loop_paramedic"], true);
    await Delay(10000);
    ClearPedTasks(pedId);
    serverEvent("Server.LSMS.Action", 1, GetPlayerServerId(targetId));
}

let initiedDeath = false;
zFramework.Core.LSMS.PostRevive = function() {
    const { getLocation } = zFramework.LocalPlayer;
    let pedId = zFramework.LocalPlayer.pedId;

    serverEvent("Server.LSMS.SetDead", false);
    initiedDeath = false;
    zFramework.LocalPlayer.invincible = false;
    if (IsEntityDead(pedId)) this.Revive();
    pedId = zFramework.LocalPlayer.pedId;
    zFramework.Functions.Notify("~g~REANIMATION~w~\nVous venez d'être réanimé, vous êtes blessé.");
    zFramework.Core.Needs.Reset(false);
    ClearTimecycleModifier();
    zFramework.Core.HUD.RemoveTimerBar();
    //CreateEffect
    this.SetPlayerWounded();
    ClearPedBloodDamage(pedId);
    SetEntityHealth(pedId, 150);
    ClearAreaOfPeds(getLocation().x, getLocation().y, getLocation().z, 6.0, 1);
    DecorRemove(pedId, "Player_Dead");
}

zFramework.Core.LSMS.Revive = function() {
    const { pedId, getLocation } = zFramework.LocalPlayer;
    NetworkResurrectLocalPlayer(getLocation().x, getLocation().y, getLocation().z, GetEntityHeading(pedId), false, false);
    setTimeout(() => {
        const newPed = GetPlayerPed(-1);
        if (pedId != newPed) DeleteEntity(pedId);
    }, 100);
    zFramework.LocalPlayer.invincible = false;
    SetEntityHealth(PlayerPedId(), 125);
    zFramework.LocalPlayer.pedId = PlayerPedId();
}

function canRevive() {
    const exists = !DoesEntityExist(GetEntityAttachedTo(zFramework.LocalPlayer.pedId))
    if (!exists) zFramework.Functions.Notify("~r~Votre situation vous contraint d'accéder à une réanimation.");
    return exists;
}

onNet("Client.LSMS.Action", (action, value) => {
    const { pedId, dead } = zFramework.LocalPlayer;
    switch (action) {
        case 1:
            if ((dead || IsEntityDead(pedId)) && canRevive()) {
                zFramework.Core.LSMS.PostRevive();
            }
            break;
        case 2:
            if (!IsPedRagdoll(pedId)) {
                SetEntityHealth(pedId, value == 200 && GetEntityMaxHealth(pedId) || GetEntityHealth(pedId) +  value);
                zFramework.LocalPlayer.wounded = false;
                zFramework.Core.Inventory.UpdatePlayerSpeed();
                zFramework.Functions.Notify("~g~SOIN~w~\nVous avez été soigné par un médecin, vous n'êtes plus blessé.");
            }
            break;
    }
});

on("EntityDeath", (victim, instigator, weapon) => {
    const { ko, dead } = zFramework.LocalPlayer;
    if (victim && !ko && IsEntityDead(victim)) {
        zFramework.Core.LSMS.Revive();
        zFramework.LocalPlayer.ragdoll = true;
        zFramework.LocalPlayer.invincible = true;

        if (!dead || !initiedDeath) {
            serverEvent("Server.LSMS.SetDead", true);
            zFramework.Functions.Notify("~r~COMA~w~\nVoulez-vous contacter une ambulance ?");
            zFramework.Functions.Notify("Appeler: ~g~E~w~ ou ~r~Y");
            DecorSetBool(GetPlayerPed(-1), "Player_Dead", true);
            deathTimer = GetGameTimer() || 0;
            ShakeGameplayCam("DEATH_FAIL_IN_EFFECT_SHAKE", 1.0);
            SetTimecycleModifier("rply_vignette");
            zFramework.Core.HUD.AddTimerBar("TEMPS RESTANT", { endTime: GetGameTimer() + deathTime });
            initiedDeath = true;
        }

        victim = GetPlayerPed(-1);
        SetPedToRagdoll(victim, 1000, 1000, 0, 1, 1, 0);
    }
});

RegisterCommand("revive", () => zFramework.Core.LSMS.PostRevive());

async function endKO() {
    if (zFramework.LocalPlayer.ko) {
        serverEvent("Server.LSMS.SetDead", false);
        zFramework.LocalPlayer.ragdoll = true;
        zFramework.LocalPlayer.busy = 1;
        
        if (GetGameTimer() >= koTimer) {
            const { pedId } = zFramework.LocalPlayer;
            zFramework.LocalPlayer.busy = IsEntityAttachedToAnyVehicle(pedId) && 1 || 0;
            zFramework.LocalPlayer.ko = false;
            zFramework.LocalPlayer.invincible = false;
            
            await zFramework.Functions.RequestAnimSet("move_m@injured");
            SetPedMovementClipset(pedId, "move_m@injured", 0);
        } else {
            ShakeGameplayCam("DEATH_FAIL_IN_EFFECT_SHAKE", 1.0);
            SetTimecycleModifier("damage");
            while (GetGameTimer() <= koTimer) await Delay(0);
            DoScreenFadeOut(1000);
            await Delay(1000);
            ClearTimecycleModifier();
            DoScreenFadeIn(1000);
        }
    }
}

on("EntityKO", async () => {
    const { needs, dead } = zFramework.LocalPlayer;
    if (needs.hunger <= 0 || needs.thirst <= 0 || dead) return;

    serverEvent("Server.LSMS.SetDead", false);
    zFramework.LocalPlayer.ragdoll = true;
    zFramework.LocalPlayer.invincible = true;
    zFramework.LocalPlayer.ko = true;
    zFramework.LocalPlayer.busy = 1;
    zFramework.Core.LSMS.Revive();

    const { pedId } = zFramework.LocalPlayer;
    SetPedToRagdollWithFall(pedId, 1500, 2000, 0, -GetEntityForwardVector(pedId), 1.0, 0.0, .0, .0, .0, .0, .0);
    koTimer = GetGameTimer() + koTime;
    zFramework.Core.HUD.CreateProgressBar("Inconscient", koTime);

    while (zFramework.LocalPlayer.ko) {
        await Delay(0);
        endKO();
    }

    zFramework.Core.LSMS.SetPlayerWounded(60 * 1000 * 3);
});

let unk_1 = null;
zFramework.Core.LSMS.SetPlayerWounded = async (time) => {
    const { pedId } = zFramework.LocalPlayer;

    unk_1 = null;
    zFramework.LocalPlayer.wounded = true;
    zFramework.LocalPlayer.cantRun = true;
    RemoveAllPedWeapons(pedId);
    ResetPedMovementClipset(pedId, 0);
    await zFramework.Functions.RequestAnimSet("move_m@injured");
    SetPedMovementClipset(pedId, "move_m@injured", 0);
    unk_1 = true;
    const timer = GetGameTimer() + (time || deathTime);
    while (unk_1 && GetGameTimer() < timer && zFramework.LocalPlayer.wounded) await Delay(1000);
    if (GetGameTimer() >= timer && zFramework.LocalPlayer.wounded) {
        zFramework.LocalPlayer.wounded = false;
        zFramework.Core.Inventory.UpdatePlayerSpeed();
    }
    unk_1 = null;
}

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
        if (item == reviveItem) zFramework.Core.LSMS.RevivePlayer(targetId);
        else if (item == healItem) zFramework.Core.LSMS.HealPlayer(targetId, 200);
    });
}

zFramework.Core.LSMS.OpenMenu = function() {
    if (emsMenu.Opened) return emsMenu.Close();
    emsMenu.Open();
}

zFramework.Core.LSMS.Initialize = function() {
    registerJobMenu();
    zFramework.Core.Job.RegisterMenu(2, zFramework.Core.LSMS.OpenMenu, true, true);
    DecorRegister("Player_Dead", 2);
    this.Thread();
}

zFramework.Core.LSMS.Thread = function() {
    setInterval(async () => {
        await Delay(4000);
        const { dead, ko } = zFramework.LocalPlayer;
        if (IsEntityDead(PlayerPedId()) && !dead && !ko)
            TriggerEvent("EntityDeath", PlayerPedId());
    }, 4000);
}

zFramework.Core.LSMS.Think = function() {
    if (zFramework.LocalPlayer.cantRun) {
        DisableControlAction(0, 21, 1);
        DisableControlAction(0, 22, 1);
    }
    if (zFramework.LocalPlayer.dead) {
        deathTimer = deathTimer || GetGameTimer();
        const respawnButton = IsControlJustPressed(1, 246), callButton = IsControlJustPressed(1, 51);
        if ((respawnButton || callButton) && canRevive() && (callButton || (deathTimer + deathTime) < GetGameTimer())) {
            if (!callButton) console.log("respawn");
            else {
                zFramework.Functions.Notify("~b~Vous avez appelé les urgences.");
                // Call emergency
            }
        }
    }
}