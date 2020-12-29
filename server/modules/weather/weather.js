zFramework.Modules.Weather.Freezed = false;

zFramework.Modules.Weather.PickWeather = function(data) {
    let winner = Number(Math.random().toFixed(2));

    for (let i=0; i < data.length; i++) {
        let threshold = parseFloat(data[i].luck);
        
        if (threshold <= winner)
            return data[i].name;
    }
}

zFramework.Modules.Weather.Initialize = function() {
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

onNet("onPlayerSpawned", function() {
    if (!zFramework.Modules.Weather.Initialized) return;
	const player = zFramework.Players[global.source];
    if (!player) return;

	// Sync Weather
	player.clientEvent('Client.SetWeather', zFramework.Modules.Weather.Current, zFramework.Modules.Weather.Time);
});