let menus = {};

zFramework.Core.Job.RegisterMenu = (job, menu, serviceRequired, uniformRequired) => menus[job] = { menu, serviceRequired, uniformRequired };

zFramework.Core.Job.Initialize = function() {
    zFramework.Functions.RegisterControlKey("jobMenuBind", "Ouvrir le menu métier", "f2", () => {
        const { job } = zFramework.LocalPlayer;
        const menuData = menus[job.id];
        console.log(job.id, menuData);
        if (menuData) {
            // On Service Check
            // On Uniform Check
            console.log(menuData);
            menuData.menu();
        }
    });
}