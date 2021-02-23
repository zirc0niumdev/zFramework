const worldPickups = {}, myPickups = {};
let canPickup = false;

onNet('Client.Pickup.Management', (action, item) => {
    switch (action) {
        case 1: // Insert Own World Pickup
            const { id, model, pos, value } = item;
            worldPickups[id] = { model, pos, value };
            break;

        case 2: // Insert People World Pickups at Connection
            for (const [id, object] of Object.entries(item))
                worldPickups[id] = object;
            break;
            
        case 3: // Delete Pickup
            const object = worldPickups[item];
            if (object) {
                if (object.handle) DeleteEntity(object.handle);
                delete worldPickups[item];
                delete myPickups[item];
            }
            break;
    }
});

async function spawnPickup(object) {
    const { model, pos } = object;

    await zFramework.Functions.RequestModel(model)
    .then(async hasLoaded => {
        if (hasLoaded) {
            const handle = CreateObject(GetHashKey(model), pos.x, pos.y, pos.z, false, false, true);
            
            SetEntityDynamic(handle, true);
            PlaceObjectOnGroundProperly(handle);

            if (pos.h) SetEntityHeading(handle, pos.h + 0.0);

            const time = GetGameTimer();
            while (DoesEntityExist(handle) && !IsEntityStatic(handle) && time + 2000 > GetGameTimer()) {
                await Delay(100);
            }
            
            if (DoesEntityExist(handle)) {
                SetEntityDynamic(handle, false);
                SetEntityCollision(handle, false, true);
                FreezeEntityPosition(handle, true);
            }

            object.handle = handle;
        }
    });
}

function pickupObject(id, objPos) {
    canPickup = true;
    
    if (canPickup) {
        const { getLocation } = zFramework.LocalPlayer;
        if (getLocation().z - objPos.z > 0.6) zFramework.Functions.PlayAnim(["pickup_object", "pickup_low"]);

        setTimeout(() => {
            serverEvent("Server.Pickup.Management", 3, { id });
            PlaySoundFrontend(-1, "Bus_Schedule_Pickup", "DLC_PRISON_BREAK_HEIST_SOUNDS", false);
            
            canPickup = false;
        }, 500);
    }
}

zFramework.Core.Inventory.PickupThread = function() {
    // Pickups Checks - Creation/Deletion
    setInterval(() => {
        const { getLocation } = zFramework.LocalPlayer;

        for (const [id, object] of Object.entries(worldPickups)) {
            const pickupPos = object.handle && DoesEntityExist(object.handle) && zFramework.Functions.GetEntityLocation(object.handle) || object.pos;
            const closeToPickup = zFramework.Functions.GetDistanceByCoords(pickupPos, getLocation()) < 30;
            
            if (closeToPickup && !myPickups[id]) {
                spawnPickup(object);
                myPickups[id] = object;
            } else if (!closeToPickup && myPickups[id]) {
                delete myPickups[id];

                if (object.handle) {
                    DeleteEntity(object.handle);
                    object.handle = null;
                }
            }
        }
    }, 1000);

    // Pickups Interaction
    setTick(() => {
        let playerPos;
        if (myPickups && Object.keys(myPickups).length > 0) {
            const { getLocation, pedId } = zFramework.LocalPlayer;

            for (const [id, object] of Object.entries(myPickups)) {
                if (!playerPos) playerPos = getLocation();

                const objPos = object.handle && zFramework.Functions.GetEntityLocation(object.handle) || object.pos;
                if (IsPedOnFoot(pedId) && zFramework.Functions.GetDistanceByCoords(objPos, playerPos) < 2) {
                    zFramework.Functions.DrawText3D(objPos.x, objPos.y, objPos.z + 0.25, "~b~[E]~s~ pour ramasser", 6);

                    if (zFramework.Functions.GetDistanceByCoords(objPos, playerPos) < 1.2) {
                        DisableControlAction(0, 51, true);
                        if (IsDisabledControlJustPressed(0, 51)) {
                            pickupObject(id, objPos);
                        }
                    }
                }

                break;
            }
        }
    });
}