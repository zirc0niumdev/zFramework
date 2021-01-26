zFramework = {};
zFramework.Initialized = false;
zFramework.Functions = {};
zFramework.Modules = {};
zFramework.Modules.List = {
	Weather: true,
	Discord: true
};

if (IsDuplicityVersion()) {
	SetMapName('Los Santos');
	SetGameType('zFramework');

	zFramework.DB = {};
	zFramework.Commands = {};
	zFramework.Players = {};
} else {
	zFramework.LocalPlayer = null;
}

zFramework.Modules.Initialize = function() {
	for (const moduleName in this.List) {
		if (!this.List[moduleName]) return;

		if (this[moduleName] && this[moduleName]["Initialize"]) {
			this[moduleName].Initialize();
			console.log(`^3[zFramework] ^7Module ^2${moduleName} ^7initialized.\n`);
		}
	}
}