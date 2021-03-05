zFramework.Core.Needs.Initialize = function() {
    setInterval(() => {
        const localPlayer = zFramework.LocalPlayer;
        this.Thread(localPlayer);
    }, 100000);
}

zFramework.Core.Needs.Reset = function(shouldKill) {
    serverEvent("Server.Needs.Add", true, 150);
    serverEvent("Server.Needs.Add", false, 150);
    if (shouldKill) ApplyDamageToPed(zFramework.LocalPlayer.pedId, 500);
}

DrawNeedsBar = (x, y, width, height, color) => DrawRect(x + width / 2, y + height / 2, width, height, color[0], color[1], color[2], color[3]);

zFramework.Core.Needs.Think = function() {
    if (!zFramework.LocalPlayer.cinemaMode) {
        const { hunger, thirst } = zFramework.LocalPlayer.needs;
        DrawNeedsBar(0.016 - .001, this.Y - 0.015, 0.14, .014, [247, 197, 59, 75]);
        DrawNeedsBar(0.016 - .001, this.Y - 0.015, (hunger / 100) * .14, .014, [247, 197, 59, 155]);
        DrawNeedsBar(0.016 - .001, this.Y, .14, .014, [31, 162, 255, 75]);
        DrawNeedsBar(0.016 - .001, this.Y, (thirst / 100) * .14, .014, [31, 162, 255, 155]);
    }
}

zFramework.Core.Needs.Thread = function(localPlayer) {
    if (!localPlayer.dead && localPlayer.busy <= 1 && !localPlayer.spectateMode && IsPedHuman(localPlayer.pedId)) serverEvent("Server.Needs.Thread");
}

zFramework.Core.Needs.OnUpdated = function() {
    const { hunger, thirst } = zFramework.LocalPlayer.needs;
    if (thirst <= 0 || hunger <= 0) {
        this.Reset(true);
        zFramework.Functions.Notify(`~r~Vous êtes mort de ~y~${hunger <= 0 ? "faim" : "soif"}~w~.`);
    } else if (thirst < 10 || hunger < 10)
        zFramework.Functions.Notify("~y~Vous avez mal au ventre.");
}