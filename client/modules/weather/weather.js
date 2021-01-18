zFramework.Modules.Weather.Initialize = function() {
    this.Initialized = true;
}

onNet("Client.SetWeather", function(weather, time) {
    if (!zFramework.Modules.Weather.Initialized) return;

    if (weather) {
        ClearWeatherTypePersist();
        ClearOverrideWeather();
        SetWeatherTypeOverTime(weather, 200.0);
        SetWeatherTypePersist(weather);
        
        zFramework.Modules.Weather.Current = weather;
    }

    if (time) {            
        NetworkClearClockTimeOverride();
        NetworkOverrideClockTime(time.Hour, time.Minute, 0);
        
        zFramework.Modules.Weather.Time = {Hour: time.Hour, Minute: time.Minute};
    }
});