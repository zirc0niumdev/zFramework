zFramework.Modules.Weather = {};
zFramework.Modules.Weather.Initialized = false;

zFramework.Modules.Weather.List = [
	{ name: "THUNDER", luck: 0.98 },
	{ name: "SMOG", luck: 0.82 },
	{ name: "FOGGY", luck: 0.74 },
	{ name: "RAIN", luck: 0.75 },
	{ name: "OVERCAST", luck: 0.62 },
	{ name: "CLOUDS", luck: 0.40 },
	{ name: "CLEAR", luck: 0.24 },
	{ name: "EXTRASUNNY", luck: 0.01 }
];

zFramework.Modules.Weather.Current = zFramework.Modules.Weather.List[7].name;
zFramework.Modules.Weather.Time = {Hour: 8, Minute: 0};
