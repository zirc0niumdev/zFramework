let NPCs = [];
let myNPCs = [];

zFramework.NPC.Register = (data, next) => {
    data.next = next;
    NPCs.push(data);
}

async function CreateNPC(data) {
    await zFramework.Functions.RequestModel(data.model)
    .then(hasLoaded => {
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

        return handle;
    });
}


zFramework.Core.NPC.Thread = () => {
    setInterval(() => {
        const { getLocation } = zFramework.LocalPlayer;
    
        for ([id, data] of Object.entries(NPCs)) {
            const closeFromNPC = zFramework.Functions.GetDistanceByCoords(getLocation(), data.pos) < 30;
    
            if (!myNPCs[id] && closeFromNPC)
                myNPCs[id] = CreateNPC(data);
            else if (myNPCs[id] && !closeFromNPC) {
                DeleteEntity(myNPCs[id])
                myNPCs.splice(id, 1);
            }
        }
    }, 2000);
}

zFramework.Core.NPC.Initialize = function() {
    this.Thread();
}