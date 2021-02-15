import CCommands from '../../class/CCommands';

zFramework.Modules.Weather.PickWeather = data => {
    const winner = Number(Math.random().toFixed(2));
    for (let i=0; i < data.length; i++) {
        const threshold = parseFloat(data[i].luck);
        if (threshold <= winner) return data[i].name;
    }
}

zFramework.Modules.Weather.Initialize = function() {
    new CCommands("freezetime", zFramework.Groups.SUPERADMIN, (player, args) => {
        zFramework.Modules.Weather.Freezed = !zFramework.Modules.Weather.Freezed;
        player.notify(`~g~Vous~w~ avez ${zFramework.Modules.Weather.Freezed ? "freeze" : "unfreeze"} le temps !`);
    }, {help: "haha"});
    
    new CCommands("time", zFramework.Groups.SUPERADMIN, (player, args) => {
        if (args[0] && args[0] > 23 || args[0] < 0) return;
        if (args[1] && args[1] > 59 || args[1] < 0) return;
    
        zFramework.Modules.Weather.Time.Hour = Number(args[0]);
        zFramework.Modules.Weather.Time.Minute = Number(args[1]);
    
        emitNet('Client.SetWeather', -1, null, zFramework.Modules.Weather.Time);
        player.notify(`~g~Vous~w~ avez set le temps à ${args[0]} ${args[1]} !`);
    }, {help: "haha"});
    
    new CCommands("weather", zFramework.Groups.SUPERADMIN, (player, args) => {
        const weatherFound = zFramework.Modules.Weather.List.find(weather => weather.name === args[0]);
        if (!weatherFound) return;
    
        emitNet('Client.SetWeather', -1, weatherFound.name, null);
        player.notify(`~g~Vous~w~ avez set la météo sur ${weatherFound.name} !`);
    }, {help: "haha"});

    // Time of Day
    const timeChangeInterval = setInterval(() => {
        if (this.Freezed == false) return;

        this.Time.Minute++;
    
        if (this.Time.Minute > 59) {
            this.Time.Minute = 0;
            this.Time.Hour++;
        }
    
        if (this.Time.Hour > 23)
            this.Time.Hour = 0;
    
        emitNet('Client.SetWeather', -1, null, this.Time);
    }, 60000);
    
    // Weather
    const weatherInterval = setInterval(() =>  {
        if (this.Freezed == false) return;
        emitNet('Client.SetWeather', -1, this.PickWeather(this.List), null);
    }, 3600000);

    this.Initialized = true;
}

onNet("Server.onPlayerSpawned", async () => {
    if (!zFramework.Modules.Weather.Initialized) return;
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

	// Sync Weather
	player.clientEvent('Client.SetWeather', zFramework.Modules.Weather.Current, zFramework.Modules.Weather.Time);
});