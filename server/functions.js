zFramework.Functions.SavePlayers = function() {
	const playersCount = GetNumPlayerIndices();
	if (playersCount < 2) return;
	
	for (let i = 1; i < playersCount+1; i++) {
		if (!zFramework.Players[i]) return;
		zFramework.Players[i].savePlayer();
	}

	console.log(`\x1b[33m[zFramework]\x1b[37m Saved ${playersCount} players!`);
}

setInterval(zFramework.Functions.SavePlayers, 600000);