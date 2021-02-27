let NPCs = {};
let myNPCs = {};

zFramework.Core.NPC.Register = (data, next) => {
    data.next = next;
    NPCs[Object.keys(NPCs).length + 1] = data;
}

async function CreateNPC(data) {
    await zFramework.Functions.RequestModel(data.model)
    .then(hasLoaded => {
        if (hasLoaded) {
            const handle = CreatePed(4, data.model, data.pos.x, data.pos.y, data.pos.z, data.pos.h || 0.0, false, false);
    
            FreezeEntityPosition(handle, true);
            SetBlockingOfNonTemporaryEvents(handle, true);
    
            SetPedRandomProps(handle);
            SetPedRandomComponentVariation(handle, true);
    
            SetPedFleeAttributes(handle, 0, false);
            SetPedKeepTask(handle, true);
    
            if (data.text && data.text[0]) console.log("draw text 3d");
    
            if (data.anim) zFramework.Functions.ForceAnim(data.anim, 1, { ped: handle});
    
            if (data.next) data.next(handle, data.stuff);
    
            data.handle = handle;
        }
    });
}

zFramework.Core.NPC.Initialize = function() {
    setInterval(() => {
        const { getLocation } = zFramework.LocalPlayer;
    
        for (const [id, data] of Object.entries(NPCs)) {
            const closeFromNPC = zFramework.Functions.GetDistanceByCoords(getLocation(), data.pos) < 30;

            if (!myNPCs[id] && closeFromNPC) {
                CreateNPC(data);
                myNPCs[id] = data;
            } else if (myNPCs[id] && !closeFromNPC) {
                delete myNPCs[id];
                if (myNPCs[id].handle) DeleteEntity(myNPCs[id].handle);
            }
        }
    }, 2000);
}