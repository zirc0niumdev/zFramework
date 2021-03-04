let menus = {};

zFramework.Core.Jobs.RegisterMenu = (job, menu, serviceRequired, uniformRequired) => menus[job] = { menu, serviceRequired, uniformRequired };

zFramework.Core.Jobs.Initialize = function() {
    zFramework.Functions.RegisterControlKey("jobMenuBind", "Ouvrir le menu métier", "f2", () => {
        const { job } = zFramework.Localplayer;
        const menuData = menus[job];

        if (menuData) {
            // On Service Check
            // On Uniform Check

            menuData.menu();
        }
    });
}