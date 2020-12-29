zFramework.Modules.Weather.Initialize = function() {
    this.Initialized = true;
}

onNet("Client.SetWeather", function(weatherName, time) {
    if (!zFramework.Modules.Weather.Initialized) return;

    if (weatherName) {
        ClearWeatherTypePersist();
        ClearOverrideWeather();
        SetWeatherTypeOverTime(weatherName, 200.0);
        SetWeatherTypePersist(weatherName);
        
        zFramework.Modules.Weather.Current = weatherName;
    }

    if (time) {            
        NetworkClearClockTimeOverride();
        NetworkOverrideClockTime(time.Hour, time.Minute, 0);
        
        zFramework.Modules.Weather.Time = {Hour: time.Hour, Minute: time.Minute};
    }
});