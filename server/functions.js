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

zFramework.Functions.GenerateExpDate = () => {
    const today = new Date();

    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 2;
    let dd = today.getDate();

    if (dd < 10){
        dd = '0' + dd;
    } 

    if (mm < 10) {
        mm = '0' + mm;
    }

    return `${dd}/${mm}/${yyyy}`;
}

zFramework.Functions.GenerateUUID = () => `667${Date.now() + Math.floor(Math.random() * 100)}`;

onNet("Server.AskId", async (targetId, name, num) => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
	const item = player.inventory.items[name][num];
	if (!item) return;

	let type = 1;

	switch (name) {
		case "Carte d'identité":
			type = 1;
			break;
		case "Carte d":
			type = 2;
			break;
		case "Car":
			type = 3;
			break;
	}
	
	if (targetId) {
		const target = await zFramework.Functions.GetPlayerFromId(targetId);
		return target.clientEvent("Client.ShowId", type, item);
	}
	
	return player.clientEvent("Client.ShowId", type, item);
});