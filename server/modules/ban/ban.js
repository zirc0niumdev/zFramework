import CCommands from '../../class/CCommands';

zFramework.Modules.Ban.Initialize = function() {
    new CCommands("banadd", zFramework.Groups.ADMIN, async (player, args) => {
        const target = await zFramework.Functions.GetPlayerFromId(args[0]);
        const identifiers = target.getIdentifiers();
        const time = parseInt(args[1]) || -1;
        const reason = args.slice(2).join(' ') || "Aucune raison spécifiée";
        const date = getDate();
        const banData = [JSON.stringify(identifiers), reason, player.name, date];
        
        await zFramework.Database.Query('INSERT INTO bans (identifiers, reason, banner, date) VALUES (?, ?, ?, ?)', banData).then(async () => {
            await this.Refresh();
            target.kick(`Vous avez été ban de SantosRP.\nRaison: ${reason}\nTemps: ${time == -1 ? "Infini" : (time > 1 ? `${temps} jours` : `${temps} jour`)}`);
        });

    }, {help: "haha"});
    
    this.Initialized = true;
    this.OnInitialize();
}

zFramework.Modules.Ban.OnInitialize = function() {
    this.Refresh();
}

zFramework.Modules.Ban.CheckUser = async function(identifiers) {
    if (!this.Initialized) return;
    
    // might not work as intented.
    return new Promise((resolve, reject) => {
        this.Users.some(bans => {
            const bannedIdentifiers = JSON.parse(bans.identifiers);
            for (const identifier in bannedIdentifiers)
            {
                if (bannedIdentifiers[identifier].includes(identifiers.discord) || bannedIdentifiers[identifier].includes(identifiers.license)
                || bannedIdentifiers[identifier].includes(identifiers.steam) || bannedIdentifiers[identifier].includes(identifiers.ip)
                || bannedIdentifiers[identifier].includes(identifiers.license2) || bannedIdentifiers[identifier].includes(identifiers.xbox)) {
                    reject(bans.reason);
                }
            }
        });
                
        resolve();
    });
}

zFramework.Modules.Ban.Refresh = async function() {
    if (!this.Initialized) return;
    
    await zFramework.Database.Query('SELECT * FROM bans').then(res => {
        for (let i = 0; i < res.length; i++) this.Users[i] = res[i];
    });
}