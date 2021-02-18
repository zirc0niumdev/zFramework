

zFramework.Needs.Initialize = function() {
    setInterval(() => {
        const localPlayer = zFramework.LocalPlayer;
        this.Thread(localPlayer);
    }, 100000);
}

zFramework.Needs.Reset = function(kill) {
    zFramework.LocalPlayer.Needs.Hunger = 100;
    zFramework.LocalPlayer.Needs.Thirst = 100;
    if (kill) ApplyDamageToPed(zFramework.LocalPlayer.pedId, 500);
}

const x = 0.016;
const y = 0.792;
DrawNeedsBar = (x, y, width, height, color) => DrawRect(x + width / 2, y + height / 2, width, height, color[0], color[1], color[2], color[3]);

zFramework.Needs.Think = function() {
    if (!zFramework.LocalPlayer.cinemaMode) {
        const { Hunger, Thirst } = zFramework.LocalPlayer.Needs;
        
        DrawNeedsBar(x - .001, y - 0.015, 0.14, .014, [247, 197, 59, 75]);
        DrawNeedsBar(x - .001, y - 0.015, (Hunger / 100) * .14, .014, [247, 197, 59, 155]);
        DrawNeedsBar(x - .001, y, .14, .014, [31, 162, 255, 75]);
        DrawNeedsBar(x - .001, y, (Thirst / 100) * .14, .014, [31, 162, 255, 155]);
    }
}

zFramework.Needs.Thread = function(localPlayer) {
    if (!localPlayer.dead && !localPlayer.spectateMode && IsPedHuman(localPlayer.pedId)) {
        serverEvent("Server.Needs.Thread");

        if (zFramework.LocalPlayer.Thirst <= 0 || zFramework.LocalPlayer.Hunger <= 0) {
            this.Reset(true);
            zFramework.Functions.Notify(`~r~Vous êtes mort de ~b~${zFramework.LocalPlayer.Hunger <= 0 ? "faim" : "soif"}~w~.`);
        } else if (zFramework.LocalPlayer.Needs.Thirst < 10 || zFramework.LocalPlayer.Needs.Thirst < 10) zFramework.Functions.Notify("~y~Vous avez mal au ventre.");
    }
}

zFramework.Needs.AddHunger = amount => {
    zFramework.LocalPlayer.Needs.Hunger = Math.max(0, Math.min(100, zFramework.LocalPlayer.Needs.Hunger + amount));
}

zFramework.Needs.AddThirst = amount => {
    zFramework.LocalPlayer.Needs.Thirst = Math.max(0, Math.min(100, zFramework.LocalPlayer.Needs.Thirst + amount));
}