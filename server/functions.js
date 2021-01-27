zFramework.Functions.GetPlayerFromId = id => {
	if (id > 50000) return;
	
	return new Promise((resolve, reject) => {
		const player = zFramework.Players[id];
		if (!player) reject(console.error("can't get player with id: " + id));
		
		resolve(player);
	});
}