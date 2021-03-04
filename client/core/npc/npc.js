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
    
            if (data.text && data.text[0]) zFramework.Core.HUD.Register3DText(handle, data.text[0], data.text[1]);
    
            if (data.anim) zFramework.Functions.ForceAnim(data.anim, 1, { ped: handle});
    
            if (data.next) data.next(handle, data.stuff);
    
            data.handle = handle;
        }
    });
}

zFramework.Core.NPC.Thread = localPlayer => {
    for (const [id, data] of Object.entries(NPCs)) {
        const closeFromNPC = zFramework.Functions.GetDistanceByCoords(localPlayer.getLocation(), data.pos) < 30;

        if (!myNPCs[id] && closeFromNPC) {
            CreateNPC(data);
            myNPCs[id] = data;
        } else if (myNPCs[id] && !closeFromNPC) {
            if (myNPCs[id].handle) DeleteEntity(myNPCs[id].handle);
            delete myNPCs[id];
        }
    }
}

zFramework.Core.NPC.Initialize = function() {
    setInterval(() => {
        const localPlayer = zFramework.LocalPlayer;
        this.Thread(localPlayer);
    }, 2000);
}