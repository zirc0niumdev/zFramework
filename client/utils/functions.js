import Vector3 from "../../shared/class/CVector3";

global.serverEvent = (eventName, ...args) => emitNet(eventName, ...args);

zFramework.Functions.GetDistance = function(entity, target) {
	if (!DoesEntityExist(entity) || !DoesEntityExist(target)) return;

	const entityCoords = this.GetEntityLocation(entity);
	const targetCoords = this.GetEntityLocation(target);

	return entityCoords.distance(targetCoords);
}

zFramework.Functions.GetDistanceByCoords = (entityCoords, targetCoords) => {
	const entCoords = new Vector3(entityCoords.x, entityCoords.y, entityCoords.z);

	return entCoords.distance(targetCoords);
};

zFramework.Functions.GetEntityLocation = (entity) => {
	if (!DoesEntityExist(entity)) return;
	return new Vector3(GetEntityCoords(entity)[0].toFixed(2), GetEntityCoords(entity)[1].toFixed(2), GetEntityCoords(entity)[2].toFixed(2));
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
				resolve(false);
			}

			switch (UpdateOnscreenKeyboard()) {
				case 1:
					clearInterval(timer);

					let result = GetOnscreenKeyboardResult();
					if (result)
						result = result.trim();

					if (!result || result.length === 0) {
						resolve(false);
					} else {
						resolve(result);
					}
					break;
				case 2:
					clearInterval(timer);
					resolve(false);
					break;
				case 3:
					clearInterval(timer);
					resolve(false);
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
	return new Promise(async resolve => {
		if (!IsModelInCdimage(model) || !IsModelValid(model)) resolve(false);
		
		RequestModel(model);
		while (!HasModelLoaded(model))
			await Delay(150);

		SetModelAsNoLongerNeeded(model);
		resolve(HasModelLoaded(model));
	});
};

zFramework.Functions.RequestDict = dict => {
	return new Promise(resolve => {
		if (!DoesAnimDictExist(dict)) resolve(false);
		
		RequestAnimDict(dict);
		const start = GetGameTimer();
		const interval = setTick(() => {
			if (HasAnimDictLoaded(dict) || GetGameTimer() - start >= 1000) {
				clearTick(interval);
				resolve(HasAnimDictLoaded(dict));
		  	}
		});
	});
};

zFramework.Functions.GetClosestPlayer = function(d = 1.5) {
	const { pedId } = zFramework.LocalPlayer;
	let closestPlayer;

	for (const num of GetActivePlayers()) {
		const otherPed = GetPlayerPed(num);
		
		if (otherPed && otherPed != pedId && IsEntityVisible(otherPed) && this.GetDistance(otherPed, pedId) <= d && (!closestPlayer || this.GetDistance(otherPed, pedId)))
			closestPlayer = num;
	}

	return closestPlayer;
}

zFramework.Functions.PlayAnim = function(anims, time, flag = false, ped, pos) {
	if (typeof(anims) !== "object") anims = [anims];
	const { pedId, can, isInVehicle } = zFramework.LocalPlayer;

	ped = ped || pedId;

	if (!anims || !anims[0] || anims[0].length < 1) return;

	if (IsPedRunningRagdollTask(ped) || !can || IsEntityPlayingAnim(ped, anims[0], anims[1], 3) || IsPedActiveInScenario(ped) || isInVehicle())
		return ClearPedTasks(ped);

	this.ForceAnim(anims, flag, { ped, time, pos });
}

const animBug = ["WORLD_HUMAN_MUSICIAN", "WORLD_HUMAN_CLIPBOARD"];
const femaleFix = {
	["WORLD_HUMAN_BUM_WASH"]: ["amb@world_human_bum_wash@male@high@idle_a", "idle_a"],
	["WORLD_HUMAN_SIT_UPS"]: ["amb@world_human_sit_ups@male@idle_a", "idle_a"],
	["WORLD_HUMAN_PUSH_UPS"]: ["amb@world_human_push_ups@male@base", "base"],
	["WORLD_HUMAN_BUM_FREEWAY"]: ["amb@world_human_bum_freeway@male@base", "base"],
	["WORLD_HUMAN_CLIPBOARD"]: ["amb@world_human_clipboard@male@base", "base"],
	["WORLD_HUMAN_VEHICLE_MECHANIC"]: ["amb@world_human_vehicle_mechanic@male@base", "base"]
}

zFramework.Functions.ForceAnim = async function(anims, flag = false, args = {}) {
	flag = flag && parseInt(flag);
	const { LocalPlayer } = zFramework;
	const ped = args.ped || LocalPlayer.pedId, time = args.time, clearTasks = args.clearTasks, animPos = args.pos, animRot = args.ang;

	if (LocalPlayer.isInVehicle() && (!flag || flag < 40)) return;

	if (!clearTasks) ClearPedTasks(ped);

	if (!anims[1] && femaleFix[anims[0]] && GetEntityModel(ped) == -1667301416) anims = femaleFix[anims[0]];

	if (anims[1]) await this.RequestDict(anims[0]);

	if (!anims[1]) {
		ClearAreaOfObjects(LocalPlayer.getLocation(), 1.0);
		TaskStartScenarioInPlace(ped, anims[0], -1, !animBug.find(anim => anim === anims[0]));
	} else {
		if (!animPos) TaskPlayAnim(ped, anims[0], anims[1], 8.0, -8.0, -1, flag || 44, 0, false, false, false);
		else TaskPlayAnimAdvanced(ped, anims[0], anims[1], animPos.x, animPos.y, animPos.z, animRot.x, animRot.y, animRot.z, 8.0, -8.0, -1, flag || 44, -1, 0, 0);
	}

	if (time && typeof(time) === "number") {
		await Delay(time);
		ClearPedTasks(ped);
	}

	if (!args.dict) RemoveAnimDict(anims[0]);
}

zFramework.Functions.TaskSynchronizedTasks = async function(ped, animData, clearTasks = false) {
	for (const v of animData) this.RequestDict(v.anim[0]);

	const [_, sequence] = OpenSequenceTask(0);
	for (const v of animData) TaskPlayAnim(0, v.anim[0], v.anim[1], 2.0, -2.0, Math.floor(v.time || -1), v.flag || 48, 0, 0, 0, 0);

	CloseSequenceTask(sequence);
	if (clearTasks) ClearPedTasks(ped);
	TaskPerformSequence(ped, sequence);
	ClearSequenceTask(sequence);

	for (const v of animData) RemoveAnimDict(v.anim[10])

	return sequence;
}

const entityToAttach = null;
zFramework.Functions.AttachObjectPedHand = async function(prop, time, isFixRot, isLeftHand, isLocal) {
	const { pedId, getLocation } = zFramework.LocalPlayer;

    if (entityToAttach && DoesEntityExist(entityToAttach)) DeleteEntity(entityToAttach);

    entityToAttach = CreateObject(GetHashKey(prop), getLocation(), !isLocal);
    SetNetworkIdCanMigrate(ObjToNet(entityToAttach), false);
    AttachEntityToEntity(
        entityToAttach,
        pedId,
        GetPedBoneIndex(pedId, isLeftHand && 60309 || 28422),
        .0,
        .0,
        .0,
        .0,
        .0,
        .0,
        true,
        true,
        false,
        true,
        1,
        !isFixRot
    );

    if (time) {
        await Delay(time);
        if (entityToAttach && DoesEntityExist(entityToAttach)) DeleteEntity(entityToAttach);
        ClearPedTasks(pedId);
    }

    return entityToAttach;
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

zFramework.Functions.TopNotify = (message, beep) => {
	SetTextComponentFormat("jamyfafi");
	AddTextComponentString(message);
	DisplayHelpTextFromStringLabel(0, 0, beep, -1);
};

onNet('Client.TopNotify', zFramework.Functions.TopNotify);

onNet('Client.ShowId', (type, card) => {
	const { identity } = card;
	let data = null;

	switch (type) {
		// Carte identité
		case 1:
			data = { showID: true, name: `${identity.lastname} ${identity.firstname}`, data: `${identity.birthday} | ${identity.birthplace}`, city: "Los Santos", date: card.exp, number: card.uid };
			break;

		// Permis
		// case 2:
		// 	data = { showPermis: true, name: identity.name, userID: "zz", data: "aa" };
		// 	break;

		// Carte bancaire
		// case 3:
		// 	data = { showCardBank: true, name: identity.name, date: "aa", number: "55", gamme: "aa" };
		// 	break;
	}

	TriggerEvent('Client.ToggleNui', data);
});


zFramework.Functions.SetModel = async function(model) {
	await this.RequestModel(model)
	.then(hasLoaded => {
		if (hasLoaded) {
			SetPlayerModel(zFramework.LocalPlayer.playerId, GetHashKey(model));
			zFramework.LocalPlayer.model = model;
		}
	});
};

onNet("Client.SetModel", zFramework.Functions.SetModel);