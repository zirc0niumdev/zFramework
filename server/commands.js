import CCommands from './class/CCommands.js';

new CCommands("car", zFramework.Groups.ADMIN, async (player, args) => {
    const car = args[0];
    if (!car) return;

    const veh = CreateVehicle(GetHashKey(car), player.getLocation().x, player.getLocation().y, player.getLocation().z, GetEntityHeading(player.pedId), true, false);
    SetPedIntoVehicle(player.pedId, veh, -1);

    player.notify(`~g~${car}~w~ spawn !`);
}, { help: "haha", arguments: { name: "vehicle name", help: "hahad" } });

new CCommands("fixcar", zFramework.Groups.ADMIN, (player, args) => player.clientEvent("Client.RepairVehicle"), { help: "haha" });

new CCommands("goto", zFramework.Groups.ADMIN, async (player, args, source) => {
    const target = await zFramework.Functions.GetPlayerFromId(args[0]);
    if (args[0] == source) return;

    player.setLocation(target.getLocation());

    player.notify(`Vous vous êtes téléporté à ~g~${target.name}~w~ !`);
    target.notify(`~g~${player.name}~w~ s'est téléporté à vous !`);
}, {help: "haha"});

new CCommands("bring", zFramework.Groups.ADMIN, async (player, args, source) => {
    const target = await zFramework.Functions.GetPlayerFromId(args[0]);
    if (args[0] == source) return;

    target.setLocation(player.getLocation());

    player.notify(`Vous avez téléporté ~g~${target.name}~w~ !`);
    target.notify(`~g~${player.name}~w~ vous à téléporté !`);
}, {help: "haha"});

new CCommands("setgroup", zFramework.Groups.SUPERADMIN, async (player, args, source) => {
    const target = await zFramework.Functions.GetPlayerFromId(args[0]);
    if (args[1] && args[1] > zFramework.Groups.SUPERADMIN || args[1] < zFramework.Groups.PLAYER) return;

    target.group = parseInt(args[1]);

    target.notify(`~g~Vous~w~ avez été ajouté au groupe ${args[1]} !`);
    if (player) player.notify(`~g~${target.name}~w~ à été ajouté au groupe ${args[1]} !`);
    else console.log(`${target.name} à été ajouté au groupe ${args[1]} !`);
}, {help: "haha"});

new CCommands("setrank", zFramework.Groups.SUPERADMIN, async (player, args, source) => {
    const target = await zFramework.Functions.GetPlayerFromId(args[0]);
    if (args[1] && args[1] > zFramework.Groups.SUPERVIP || args[1] < zFramework.Groups.CITIZEN) return;
    
    target.rank = parseInt(args[1]);

    target.notify(`~g~Vous~w~ avez été ajouté au rank ${args[1]} !`);
    if (player) player.notify(`~g~${target.name}~w~ à été ajouté au rank ${args[1]} !`);
    else console.log(`${target.name} à été ajouté au rank ${args[1]} !`);
}, { help: "haha" });

new CCommands("setjob", zFramework.Groups.SUPERADMIN, async (player, args, source) => {
    const target = await zFramework.Functions.GetPlayerFromId(args[0]);

    target.job = parseInt(args[1]);
    
    const jobName = zFramework.Jobs.GetJobNameFromId(args[1]);
    target.notify(`~g~Vous~w~ avez été ajouté au job ${jobName} !`);
    if (player) player.notify(`~g~${target.name}~w~ à été ajouté au job ${jobName} !`);
    else console.log(`${target.name} à été ajouté au job ${jobName} !`);
}, {help: "haha"});

new CCommands("test", zFramework.Groups.DEV, (player, args, source) => {
}, {help: "haha"});