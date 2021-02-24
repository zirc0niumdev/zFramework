onNet("Server.Needs.Thread", async () => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.needs = { hunger: player.needs.hunger - 1, thirst: player.needs.thirst - 1.8 };
});

onNet("Server.Needs.Add", async (isHunger, amount) => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    const type = isHunger && "hunger" || "thirst";
    player.needs = { [type]: Math.max(0, Math.min(100, player.needs[type] + amount)) };
});