zFramework = {};
zFramework.Functions = {};
zFramework.Modules = {};
zFramework.Core = {};

zFramework.Modules.List = {
	Weather: true,
	Discord: true,
	Whitelist: true,
	Ban: true
}

zFramework.Core.List = {
    Inventory: true,
    Needs: true
};

if (IsDuplicityVersion()) {
	SetMapName('Los Santos');
	SetGameType('zFramework');

	zFramework.Database = {};
	zFramework.Commands = {};
	zFramework.Players = {};
	zFramework.Initialized = false;
} else {
	zFramework.LocalPlayer = null;
}