zFramework = {};
zFramework.Initialized = false;
zFramework.Functions = {};
zFramework.Modules = {};
zFramework.Modules.List = {
	Weather: true
};

if (IsDuplicityVersion()) {
	SetMapName('Los Santos');
	SetGameType('zirconium-Framework');

	zFramework.DB = {};
	zFramework.Players = {};
} else {
	zFramework.LocalPlayer = null;
}

zFramework.Modules.InitializeModules = function() {
	for (moduleName in this.List) {
		if (this.List[moduleName]) {
			if (this[moduleName] && this[moduleName]["Initialize"]) {
				this[moduleName].Initialize();
				console.log(`^3[zFramework] ^7Module ^2${moduleName} ^7initialized.\n`);
			}
		}
	}
}