zFramework = {};
zFramework.Functions = {};
zFramework.Modules = {};
zFramework.Core = {};

zFramework.Modules.List = {
	Weather: true,
	Discord: true,
	Whitelist: true,
	Ban: true
};

zFramework.Core.List = {
	CharacterCreator: false,
	NPC: true,
	Inventory: true,
	Needs: true,
	Bank: true
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