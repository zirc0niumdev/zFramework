import Vector3 from "../../../shared/class/CVector3.js";
import * as NativeUI from "../../class/menu/nativeui.js";

const adminMenu = new NativeUI.Menu("Administration", "Menu principal", new NativeUI.Point(50, 50));
function registerAdminMenu() {
    const playersListItem = new NativeUI.UIMenuItem("Liste des joueurs");
    const meItem = new NativeUI.UIMenuItem("Moi");
    const vehicleItem = new NativeUI.UIMenuItem("Véhicules");
    const worldItem = new NativeUI.UIMenuItem("Monde");
    const otherItem = new NativeUI.UIMenuItem("Autres options");
    adminMenu.AddItems([playersListItem, meItem, vehicleItem, worldItem, otherItem]);

    const meMenu = new NativeUI.Menu("Moi", adminMenu.Title, new NativeUI.Point(50, 50));
    const invincibleItem = new NativeUI.UIMenuCheckboxItem("Invincible", zFramework.LocalPlayer.invincible);
    const invisibleItem = new NativeUI.UIMenuCheckboxItem("Invisible", zFramework.LocalPlayer.invisible);
    const noclipItem = new NativeUI.UIMenuItem("No-clip");
    const reviveMeItem = new NativeUI.UIMenuItem("Réanimer");
    meMenu.AddItems([invincibleItem, invisibleItem, noclipItem, reviveMeItem]);

    adminMenu.AddSubMenu(meMenu, meItem);
    
    meMenu.ItemSelect.on(async (item, index) => {
        if (item == invincibleItem) zFramework.LocalPlayer.invincible = !zFramework.LocalPlayer.invincible;
        else if (item == invisibleItem) zFramework.LocalPlayer.invisible = !zFramework.LocalPlayer.invisible;
        else if (item == noclipItem) toggleSpectator();
        else if (item == reviveMeItem) ExecuteCommand(`revive ${zFramework.LocalPlayer.serverId}`);
    });
}

let isSpectating = false;
let spectate = {};
let spectatingPlayers = {};
let cam;
let spectateSpeed;
const defaultSpectateSpeed = 0.5;
async function toggleSpectator() {
    const { pedId } = zFramework.LocalPlayer;
    isSpectating = !isSpectating;
    zFramework.LocalPlayer.spectateMode = isSpectating;
    await Delay(10);
    if (!isSpectating) {

        if (!spectate.wasInvisible) zFramework.LocalPlayer.invisible = false;
        
        SetEntityCollision(pedId, true, true);
        SetEntityHasGravity(pedId, true);
        SetEntityCoords(pedId, GetCamCoord(cam)[0], GetCamCoord(cam)[1], GetCamCoord(cam)[2]);
        destroyCam();
        
        if (!spectate.wasInvincible) zFramework.LocalPlayer.invincible = false;

        zFramework.LocalPlayer.freeze = false;
        spectate = {};
    } else {
        createCam()
        spectate = { wasInvisible: zFramework.LocalPlayer.invisible, wasInvincible: zFramework.LocalPlayer.invincible };
        zFramework.LocalPlayer.invisible = true;

        SetEntityHasGravity(pedId, false);
        SetEntityCollision(pedId, false, false);
        SetCamCoord(cam, zFramework.LocalPlayer.getLocation().x, zFramework.LocalPlayer.getLocation().y, zFramework.LocalPlayer.getLocation().z);

        zFramework.LocalPlayer.invincible = true;
        zFramework.LocalPlayer.freeze = true;
        
        while (isSpectating) {
            await Delay(0);
            spectatorLoop(zFramework.LocalPlayer);
        }
    }
}

function spectatorLoop(localPlayer) {
    if (!NetworkIsInSpectatorMode()) {
        updateSpeed();
        moveSpectator(localPlayer);
    } //else Ebsw(localPlayer);
}

function updateSpeed() {
    const sprintButton = IsControlPressed(1, 21), walkButton = IsControlPressed(1, 36);

    if (!spectateSpeed) {
        if (sprintButton) spectateSpeed = defaultSpectateSpeed * 5.0;
        else if (walkButton) spectateSpeed = defaultSpectateSpeed * 0.1;
    } else if (!sprintButton && !walkButton)
        if (spectateSpeed) spectateSpeed = null;
}

function moveSpectator(localPlayer) {
    const upButton = IsControlPressed(1, 32), leftButton = IsControlPressed(1, 33), downButton = IsControlPressed(1, 35), rightButton = IsControlPressed(1, 34);
    const mouseRight = GetDisabledControlNormal(0, 220), mouseDown = GetDisabledControlNormal(0, 221);

    if (mouseRight != 0.0 || mouseDown != 0.0) {
        const camRot = new Vector3(GetCamRot(cam, 2)[0], GetCamRot(cam, 2)[1], GetCamRot(cam, 2)[2]);
        const newZ = camRot.z + mouseRight * -1.0 * 10.0;
        const newX = camRot.x + mouseDown * -1.0 * 10.0;
        SetCamRot(cam, newX, 0.0, newZ, 2);
        SetEntityHeading(localPlayer.pedId, newZ);
    }
    if (upButton || leftButton || downButton || rightButton) {
        let [rightVector, forwardVector] = GetCamMatrix(cam);
        rightVector = new Vector3(rightVector[0], rightVector[1], rightVector[2]);
        forwardVector = new Vector3(forwardVector[0], forwardVector[1], forwardVector[2]);
        const newPos = new Vector3(GetCamCoord(cam)[0], GetCamCoord(cam)[1], GetCamCoord(cam)[2])
            .add(((upButton && forwardVector || leftButton && forwardVector.reverse() || new Vector3(0.0, 0.0, 0.0))
            .add(downButton && rightVector || rightButton && rightVector.reverse() || new Vector3(0.0, 0.0, 0.0)))
            .multiply(spectateSpeed || defaultSpectateSpeed));

        SetCamCoord(cam, newPos.x, newPos.y, newPos.z);
        SetFocusPosAndVel(newPos.x, newPos.y, newPos.z);
        SetEntityCoords(localPlayer.Ped, newPos.x, newPos.y, newPos.z - 4.0);
    }
}


function createCam() {
    cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);
    SetCamActive(cam, true);
    RenderScriptCams(true, false, 0, true, true);
}

function destroyCam() {
    DestroyCam(cam)
    RenderScriptCams(false, false, 0, false, false)
    ClearFocus()
    if (NetworkIsInSpectatorMode()) NetworkSetInSpectatorMode(false, spectatingPlayers.id && GetPlayerPed(spectatingPlayers.id) || 0);
    cam = null;
    //lockEntity = null
    spectatingPlayers = {};
}

zFramework.Core.Admin.Initialize = function() {
    registerAdminMenu();
    zFramework.Functions.RegisterControlKey("adminMenuBind", "Ouvrir le menu administration", "f5", () => {
        const { group } = zFramework.LocalPlayer;

        if (group > zFramework.Groups.PLAYER) {
            if (!adminMenu.Opened) return adminMenu.Open();
            adminMenu.Close();
        }
    });
}