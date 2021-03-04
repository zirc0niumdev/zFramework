import Vector3 from "../../../shared/class/CVector3";

let texts = [];
let myTexts = [];

const screenCoords = { baseX: 0.918, baseY: 0.984, titleOffsetX: 0.012, titleOffsetY: -0.009, valueOffsetX: 0.0485, valueOffsetY: -0.0135, pbarOffsetX: 0.047, pbarOffsetY: 0.0015 };
const sizes = {	timerBarWidth: 0.165, timerBarHeight: 0.035, timerBarMargin: 0.038, pbarWidth: 0.0616, pbarHeight: 0.0105 };

let activeBars = [];
zFramework.Core.HUD.AddTimerBar = (title, itemData) => {
	if (!itemData) return;
	RequestStreamedTextureDict("timerbars", true);

    activeBars.push({
        title,
		text: itemData.text,
		textColor: itemData.color || [255, 255, 255, 255],
		percentage: itemData.percentage,
		endTime: itemData.endTime,
		pbarBgColor: itemData.bg || [155, 155, 155, 255],
		pbarFgColor: itemData.fg || [255, 255, 255, 255]
    });

	return activeBars.length - 1;
}

zFramework.Core.HUD.UpdateTimerBar = (barIndex, itemData) => {
	if (!activeBars[barIndex] || !itemData) return;
    for (const [key, value] of Object.entries(itemData)) activeBars[barIndex][key] = value;
}

zFramework.Core.HUD.RemoveTimerBar = () => {
    activeBars = [];
	SetStreamedTextureDictAsNoLongerNeeded("timerbars");
}

zFramework.Core.HUD.DrawText = (intFont, stringText, floatScale, intPosX, intPosY, color, boolShadow, intAlign, addWarp) => {
	SetTextFont(intFont);
	SetTextScale(floatScale, floatScale);

	if (boolShadow) {
		SetTextDropShadow(0, 0, 0, 0, 0);
		SetTextEdge(0, 0, 0, 0, 0);
    }

    console.log(color);
	SetTextColour(color[0], color[1], color[2], 255);
	if (intAlign == 0) SetTextCentre(true);
	else {
		SetTextJustification(intAlign || 1);
		if (intAlign == 2) SetTextWrap(.0, addWarp || intPosX);
    }

	SetTextEntry("STRING");
	AddTextComponentString(stringText);
	EndTextCommandDisplayText(intPosX, intPosY);
}

zFramework.Core.HUD.Draw3DText = (x, y, z, text, size = 7, alpha = 255) => {
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
    EndTextCommandDisplayText(0.0, 0.0);
    ClearDrawOrigin();
}

zFramework.Core.HUD.Initialize = function() {
    setInterval(() => {
        const localPlayer = zFramework.LocalPlayer;
        this.Thread(localPlayer);
    }, 1000);
}

const textColor = [200, 100, 100];
zFramework.Core.HUD.Think = function() {
    {
        const safeZone = GetSafeZoneSize();
		const safeZoneX = (1.0 - safeZone) * 0.5;
		const safeZoneY = (1.0 - safeZone) * 0.5;

        if (activeBars.length > 0) {
			HideHudComponentThisFrame(6);
			HideHudComponentThisFrame(7);
			HideHudComponentThisFrame(8);
			HideHudComponentThisFrame(9);

            activeBars.forEach((barData, id) => {
                const drawY = (screenCoords.baseY - safeZoneY) - (id * sizes.timerBarMargin);
				DrawSprite("timerbars", "all_black_bg", screenCoords.baseX - safeZoneX, drawY, sizes.timerBarWidth, sizes.timerBarHeight, 0.0, 255, 255, 255, 160);
				this.DrawText(0, barData.title, 0.3, (screenCoords.baseX - safeZoneX) + screenCoords.titleOffsetX, drawY + screenCoords.titleOffsetY, barData.textColor, false, 2);

				if (barData.percentage) {
					const pbarX = (screenCoords.baseX - safeZoneX) + screenCoords.pbarOffsetX;
					const pbarY = drawY + screenCoords.pbarOffsetY;
					const width = sizes.pbarWidth * barData.percentage;

					DrawRect(pbarX, pbarY, sizes.pbarWidth, sizes.pbarHeight, barData.pbarBgColor[0], barData.pbarBgColor[1], barData.pbarBgColor[2], barData.pbarBgColor[3]);
					DrawRect((pbarX - sizes.pbarWidth / 2) + width / 2, pbarY, width, sizes.pbarHeight, barData.pbarFgColor[0], barData.pbarFgColor[1], barData.pbarFgColor[2], barData.pbarFgColor[3]);
				} else if (barData.text) this.DrawText(0, barData.text, 0.425, (screenCoords.baseX - safeZoneX) + screenCoords.valueOffsetX, drawY + screenCoords.valueOffsetY, barData.textColor, false, 2);
				else if (barData.endTime) {
					const remainingTime = Math.floor(barData.endTime - GetGameTimer());
					this.DrawText(0, SecondsToClock(remainingTime / 1000), 0.425, (screenCoords.baseX - safeZoneX) + screenCoords.valueOffsetX, drawY + screenCoords.valueOffsetY, remainingTime <= 0 && textColor || barData.textColor, false, 2);
				}
            });
        }
    }

    for (const [id, textData] of Object.entries(texts)) {
        if (myTexts[id]) {
            const pos = typeof(textData[0]) === "object" && textData[0] || zFramework.Functions.GetEntityLocation(textData[0]);
            this.Draw3DText(pos.x, pos.y, pos.z + (typeof(textData[0]) === "object" && 2 || 1), textData[1], textData[2]);
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