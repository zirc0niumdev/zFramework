onNet("Server.Needs.Thread", async () => {
    const player = await zFramework.Functions.GetPlayerFromId(global.source);
    player.needs = { hunger: player.needs.hunger - 1, thirst: player.needs.thirst - 1.8 };
});

// zFramework.Core.Needs.AddHunger = amount => {
//     zFramework.LocalPlayer.Needs.hunger = Math.max(0, Math.min(100, zFramework.LocalPlayer.Needs.hunger + amount));
// }

// zFramework.Core.Needs.AddThirst = amount => {
//     zFramework.LocalPlayer.Needs.thirst = Math.max(0, Math.min(100, zFramework.LocalPlayer.Needs.thirst + amount));
// }