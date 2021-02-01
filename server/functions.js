zFramework.Functions.GetPlayerFromId = id => {
	if (id > 50000) return;
	
	return new Promise((resolve, reject) => {
		const player = zFramework.Players[id];
		if (!player) reject(console.error("can't get player with id: " + id));
		
		resolve(player);
	});
}

zFramework.Functions.CheckIdentifiers = id => {
	return new Promise((resolve, reject) => {
		let identifiers = [];
        for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) identifiers[i] = GetPlayerIdentifier(id, i);

		const discordidentifier = identifiers.some(identifier => identifier.includes('discord'));
		if (!discordidentifier) reject("Connectez votre compte discord à FiveM pour jouer sur SantosRP.");
		const steamidentifier = identifiers.some(identifier => identifier.includes('steam'));
		if (!steamidentifier) reject("Lancez steam pour jouer sur SantosRP.");
		
		resolve(identifiers);
	});
}