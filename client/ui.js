zFramework.UI = {};

let threadCreated = false;
const controlsDisabled = [1, 2, 3, 4, 5, 6, 18, 24, 25, 37, 69, 70, 182, 199, 200, 257];
zFramework.UI.KeepFocus = false;

zFramework.UI.SetKeepInputMode = bool => {
	zFramework.UI.KeepFocus = bool;

	if (!threadCreated && bool) {
		threadCreated = true;

		const timer = setTick(() => {
			if (zFramework.UI.KeepFocus) for (const control of controlsDisabled) DisableControlAction(0, control, true);
			else {
				threadCreated = false;
				clearTick(timer);
			}
		});
	}
}

zFramework.UI.SendToNui = data => SendNuiMessage(JSON.stringify(data));