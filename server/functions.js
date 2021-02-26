zFramework.Functions.GetPlayerFromId = id => {
	if (id > 50000) return;
	
	return new Promise((resolve, reject) => {
		const player = zFramework.Players[id];
		if (!player) reject(console.error("Can't get player from id: " + id));
		
		resolve(player);
	});
}

zFramework.Functions.GetIdentifiersFromId = (id, minimal = false) => {
	const identifiers = global.getPlayerIdentifiers(id);
	if (minimal) return identifiers;
        
	let identifiersObj = {};
	for (const identifier of identifiers) identifiersObj[identifier.split(':')[0]] = identifier;

	return identifiersObj;
}

zFramework.Functions.CheckIdentifiers = id => {
	return new Promise((resolve, reject) => {
		const identifiers = zFramework.Functions.GetIdentifiersFromId(id);
		if (!identifiers.discord) reject("Connectez votre compte discord à FiveM pour jouer sur SantosRP.");
		if (!identifiers.steam) reject("Lancez steam pour jouer sur SantosRP.");
		
		resolve(identifiers);
	});
}

zFramework.Functions.GenerateUUID = () => `667${Date.now() + Math.floor(Math.random() * 100)}`;

onNet("Server.AskId", async (target, name, num) => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	const item = player.inventory.items[name][num];
	if (!item) return;

	console.log(item);
});