import Vector3 from "../../../shared/class/CVector3";

let texts = [];
let myTexts = [];

zFramework.Core.HUD.Initialize = function() {
    setInterval(() => {
        const localPlayer = zFramework.LocalPlayer;
        this.Thread(localPlayer);
    }, 1000);
}

global.Draw3DText = (x, y, z, text, size = 7, alpha = 255) => {
    const cameraDistance = zFramework.Functions.GetDistanceByCoords(new Vector3(GetGameplayCamCoords()[0], GetGameplayCamCoords()[1], GetGameplayCamCoords()[2]), { x, y, z });
	const playerDistance = zFramework.Functions.GetDistanceByCoords(zFramework.LocalPlayer.getLocation(), { x, y, z }) - 1.65;
    const DHPxI = ((1 / cameraDistance) * (size * .7)) * (1 / GetGameplayCamFov()) * 100;

    if (playerDistance < size) alpha = Math.floor(255 * ((size - playerDistance) / size));
    else if (playerDistance >= size) alpha = 0;

	SetTextFont(0);
    SetTextScale(0.0 * DHPxI, .1 * DHPxI);
    SetTextColour(255, 255, 255, Math.max(0, Math.min(255, alpha)));
    SetTextCentre(1);
    SetDrawOrigin(x, y, z, 0);
    SetTextEntry("STRING");
    AddTextComponentString(text);
    DrawText(0.0, 0.0);
    ClearDrawOrigin();
}

zFramework.Core.HUD.Think = () => {
    for (const [id, textData] of Object.entries(texts)) {
        if (myTexts[id]) {
            const pos = typeof(textData[0]) === "object" && textData[0] || zFramework.Functions.GetEntityLocation(textData[0]);
            Draw3DText(pos.x, pos.y, pos.z + (typeof(textData[0]) === "object" && 2 || 1), textData[1], textData[2]);
        }
    }

    if (zFramework.LocalPlayer.cinemaMode == 1) {
        DrawRect(.0, .05, 2.0, .1, 0, 0, 0, 255);
        DrawRect(.0, .95, 2.0, .1, 0, 0, 0, 255)
        HideHudAndRadarThisFrame();
        HideHudComponentThisFrame(10);
    }
}

zFramework.Core.HUD.Thread = localPlayer => {
    const { getLocation } = localPlayer;

    texts.forEach((textData, id) => {
        if (!DoesEntityExist(textData[0])) return texts.splice(id, 1);
        const pos = typeof(textData[0]) === "object" && textData[0] || zFramework.Functions.GetEntityLocation(textData[0]);

        if (zFramework.Functions.GetDistanceByCoords(pos, getLocation()) <= textData[2]) myTexts[id] = true;
        else myTexts[id] = null;
    });

    const { inventory, cinemaMode } = localPlayer;
    if (!inventory.items["GPS"] || (cinemaMode && cinemaMode == 2)) {
        ClearGpsPlayerWaypoint();
        DisplayRadar(false);
        zFramework.Core.Needs.Y = 0.975;
    } else {
        DisplayRadar(true);
        zFramework.Core.Needs.Y = 0.792;
    }
}

onNet("Client.DrawMe", (id, text) => {
    
});

zFramework.Core.HUD.Register3DText = (handle, text, size = 8) => texts.push([handle, text, size]);