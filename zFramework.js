zFramework = {};
zFramework.Functions = {};

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