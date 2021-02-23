import Vector3 from "../../shared/class/CVector3";

serverEvent = (eventName, ...args) => emitNet(eventName, ...args);

zFramework.Functions.GetDistance = function(entity, target) {
	if (!DoesEntityExist(entity) || !DoesEntityExist(target)) return;

	const entityCoords = this.GetEntityLocation(entity);
	const targetCoords = this.GetEntityLocation(target);

	return entityCoords.distance(targetCoords);
}

zFramework.Functions.GetDistanceByCoords = (entityCoords, targetCoords) => entityCoords.distance(targetCoords);

zFramework.Functions.GetEntityLocation = (entity) => {
	if (!DoesEntityExist(entity)) return;
	return new Vector3(GetEntityCoords(entity)[0].toFixed(2), GetEntityCoords(entity)[1].toFixed(2), GetEntityCoords(entity)[2].toFixed(2));
}

zFramework.Functions.DrawText3D = function(x, y, z, text) {
	console.log(new Vector3(GetGameplayCamCoords()));
	//const JGSK, rA5U, Uc06 = table.unpack(GetGameplayCamCoords());

    // const cameraCoords = this.GetDistanceByCoords(JGSK, rA5U, Uc06, { x, y, z })

    // const textDistance = this.GetDistanceByCoords(zFramework.LocalPlayer.getLocation(), { x, y, z }) - 1.65
    // const DHPxI = ((1 / M7) * (7 * .7)) * (1 / GetGameplayCamFov()) * 100, dx = 255;

    // if (textDistance < 7) dx = Math.floor(255 * ((7 - textDistance) / 7));
    // elseif (textDistance >= 7) dx = 0;

	// SetTextFont(0);
    // SetTextScale(.0 * DHPxI, .1 * DHPxI);
    // SetTextColour(255, 255, 255, Math.max(0, Math.min(255, dx)));
    // SetTextCentre(1);
    // SetDrawOrigin(x, y, z, 0);
    // SetTextEntry("STRING");
    // AddTextComponentString(text);
    // DrawText(0.0, 0.0);
    // ClearDrawOrigin();
}

zFramework.Functions.KeyboardInput = (TextEntry = "Montant", DefaultText = "", MaxStringLenght = 60) => {
	const timeout = 0;
	AddTextEntry('FMMC_KEY_TIP8', TextEntry);
	
	return new Promise((resolve, reject) => {
		DisplayOnscreenKeyboard(false, "FMMC_KEY_TIP8", "", DefaultText, "", "", "", MaxStringLenght);
		
		const endTime = Date.now() + timeout;
		const timer = setInterval(() => {
			if (timeout > 0 && Date.now() > endTime) {
				ForceCloseTextInputBox()

				clearInterval(timer);
				reject("timeout");
			}

			switch (UpdateOnscreenKeyboard()) {
				case 1:
					clearInterval(timer);

					let result = GetOnscreenKeyboardResult();
					if (result)
						result = result.trim();

					if (!result || result.length === 0) {
						reject("empty");
					} else {
						resolve(result);
					}
					break;
				case 2:
					clearInterval(timer);
					reject("cancelled");
					break;
				case 3:
					clearInterval(timer);
					reject("keyboard_not_active");
					break;
			}
		}, 100);
	});
}

let jsonData = [];
zFramework.Functions.GetJsonConfig = (varName, inValue) => {
	if (!jsonData[varName]) {
		const jsonStr = LoadResourceFile(GetCurrentResourceName(), `config/files/${varName}.json`);
		jsonData[varName] = jsonStr != "null" && JSON.parse(jsonStr);
	}
	
	return inValue && jsonData[varName][inValue] || !inValue && jsonData[varName];
}

zFramework.Functions.RequestModel = model => {
	model = GetHashKey(model);
	return new Promise(resolve => {
		if (!IsModelInCdimage(model) || !IsModelValid(model)) resolve(false);
		
		RequestModel(model);
		const start = GetGameTimer();
		const interval = setInterval(() => {
			if (HasModelLoaded(model) || GetGameTimer() - start >= 1000) {
				clearInterval(interval);
				SetModelAsNoLongerNeeded(model);
				resolve(HasModelLoaded(model));
		  	}
		}, 0);
	});
};

zFramework.UI = {};
zFramework.UI.KeepFocus = false;
let threadCreated = false;

const controlsDisabled = [1, 2, 3, 4, 5, 6, 18, 24, 25, 37, 69, 70, 182, 199, 200, 257];

zFramework.Functions.SetKeepInputMode = bool => {
	zFramework.UI.KeepFocus = bool;

	if (!threadCreated && bool) {
		threadCreated = true;

		const timer = setTick(() => {
			if (zFramework.UI.KeepFocus) for (control of controlsDisabled) DisableControlAction(0, control, true);
			else {
				threadCreated = false;
				clearTick(timer);
			}
		});
	}
}

zFramework.Functions.GetClosestPlayer = (d = 1.5, addVector) => {
	const { pedId } = zFramework.LocalPlayer;
	let closestPlayer;

	for (const num of GetActivePlayers()) {
		const otherPed = otherPed != pedId && IsEntityVisible(otherPed) && (num);

		if (otherPedPos && zFramework.Functions.GetDistance(otherPed, pedId) <= d && (!closestPlayer || zFramework.Functions.GetDistance(otherPed, pedId)))
			closestPlayer = num;
	}

	return closestPlayer;
}

zFramework.Functions.RegisterControlKey = (strKeyName, strDescription, strKey, onPress, onRelease) => {
    RegisterKeyMapping(`+${strKeyName}`, strDescription, "keyboard", strKey);

	RegisterCommand(`+${strKeyName}`, () => {
		if (!onPress || UpdateOnscreenKeyboard() == 0) return;
        onPress();
    }, false);

    RegisterCommand(`-${strKeyName}`, () => {
        if (!onRelease || UpdateOnscreenKeyboard() == 0) return;
        onRelease();
    }, false);
}

zFramework.Functions.SendToNUI = data => {
	SendNuiMessage(JSON.stringify(data));
}

zFramework.Functions.RepairVehicle = () => {
	const vehicle = GetVehiclePedIsUsing(zFramework.LocalPlayer.pedId);
	if (!vehicle) return;

	SetVehicleFixed(vehicle);
	SetVehicleDirtLevel(vehicle, 0.0);
	SetVehicleFuelLevel(vehicle, 65.0);
};

onNet('Client.RepairVehicle', zFramework.Functions.RepairVehicle);

zFramework.Functions.Notify = (message, color) => {
	if (color) ThefeedNextPostBackgroundColor(color);
	SetNotificationTextEntry("jamyfafi");
	AddTextComponentString(message);
	DrawNotification(false, true);
	PlaySound(-1, "NAV", "HUD_AMMO_SHOP_SOUNDSET", 0, 0, 1);
};

onNet('Client.Notify', zFramework.Functions.Notify);