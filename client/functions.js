serverEvent = (eventName, ...args) => emitNet(eventName, ...args);

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