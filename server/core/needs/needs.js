onNet("Server.Needs.Thread", async () => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.Needs.thirst -= 1.8;
    player.Needs.Hunger -= 1;
});

zFramework.Needs.AddHunger = amount => {
    zFramework.LocalPlayer.Needs.hunger = Math.max(0, Math.min(100, zFramework.LocalPlayer.Needs.hunger + amount));
}

zFramework.Needs.AddThirst = amount => {
    zFramework.LocalPlayer.Needs.thirst = Math.max(0, Math.min(100, zFramework.LocalPlayer.Needs.thirst + amount));
}