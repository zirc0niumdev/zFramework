import CCommands from '../../class/CCommands';

zFramework.Modules.Ban.Initialize = function() {
    new CCommands("banadd", zFramework.Groups.ADMIN, async (player, args, source) => {
        const target = await zFramework.Functions.GetPlayerFromId(args[0]);
        const identifiers = target.getIdentifiers();
        const time = parseInt(args[1]) || -1;
        const reason = args.slice(2).join(' ') || "Aucune raison spécifiée";
        const date = getDate();
        const banData = [JSON.stringify(identifiers), reason, player.name, date];

        await zFramework.Database.Query('INSERT INTO bans (identifiers, reason, banner, date) VALUES (?, ?, ?, ?)', banData).then(async () => {
            await this.Refresh();
            target.kick(`Vous avez été ban de SantosRP.\nRaison: ${reason}\nTemps: ${time == -1 ? "infini" : time > 1 ? temps + " jours" : temps + "jour"}`);
        });
    }, {help: "haha"});
    
    this.Initialized = true;
    this.OnInitialize();
}

zFramework.Modules.Ban.OnInitialize = function() {
    this.Refresh();
}

zFramework.Modules.Ban.CheckUser = async function(id, identifiers) {
    if (!this.Initialized) return;
    
    // might not work as intented.
    return new Promise((resolve, reject) => {
        this.Users.some(bans => {
            const bannedIdentifiers = JSON.parse(bans.identifiers);
            bannedIdentifiers.some(bannedIdentifier => {
                if (bannedIdentifier.includes(identifiers.discord) && bannedIdentifier.includes(identifiers.license)
                && bannedIdentifier.includes(identifiers.steam) && bannedIdentifier.includes(identifiers.ip)
                && bannedIdentifier.includes(identifiers.license2) && bannedIdentifier.includes(identifiers.xbox)) {
                    reject(bans.reason);
                } else if (bannedIdentifier.includes(identifiers.discord) || bannedIdentifier.includes(identifiers.license)
                || bannedIdentifier.includes(identifiers.steam) || bannedIdentifier.includes(identifiers.ip)
                || bannedIdentifier.includes(identifiers.license2) || bannedIdentifier.includes(identifiers.xbox)) {
                    // Bypass ban protection, can be improved.
                    //ExecuteCommand(`banadd ${id} -1 Essaye de bypass le ban`); Need to be fixed
                    reject(bans.reason);
                }
            });
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