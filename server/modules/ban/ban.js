import CCommands from '../../class/CCommands';

zFramework.Modules.Ban.Initialize = function() {
    // ADD COMMAND
    new CCommands("bana", zFramework.Groups.ADMIN, async (player, args) => {
        const target = await zFramework.Functions.GetPlayerFromId(args[0]);
        const time = parseInt(args[1]) /* not a good way */ || -1; 
        const reason = args.slice(2).join(' ') || "Aucune raison spécifiée";
        const date = getDate(); // can be simplified
        console.log(target.name, player.name);
        const data = [JSON.stringify(target.getIdentifiers()), target.name, reason, player.name || "console", date];
        
        await zFramework.Database.Query('INSERT INTO `bans` (identifiers, username, reason, banner, date) VALUES (?, ?, ?, ?, ?)', data).then(async () => {
            await this.Refresh();
                
            target.kick(`Vous avez été ban de SantosRP.\nRaison: ${reason}\nTemps: ${time == -1 ? "Infini" : `${temps} ${(time > 1 ? `jours` : `jour`)}`}`);
                
            if (player) player.notify(`~b~Nom:~s~ ${banData[1]}\nBAN.`);
            console.log(`Nom: ${banData[1]}\nBAN.`);
        });

    }, {help: "haha"});

    // DELETE COMMAND
    new CCommands("band", zFramework.Groups.ADMIN, (player, args) => {
        const id = args[0];
        
        this.Users.some(async ban => {
            if (ban.id == id) {
                await zFramework.Database.Query('DELETE FROM `bans` WHERE `id` = ?', id).then(async () => {
                    if (player) player.notify(`~b~Nom:~s~ ${ban.username}\n~b~ID de ban:~s~ ${ban.id}\nDEBAN.`);
                    console.log(`Nom: ${ban.username}\nID de ban: ${ban.id}\nDEBAN.`);

                    await this.Refresh();
                });
            } else {
                if (player) player.notify("~r~Ban introuvable.");
                console.log("Ban introuvable.");
            }
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
    
    return new Promise((resolve, reject) => {
        this.Users.some(ban => {
            const bannedIdentifiers = JSON.parse(ban.identifiers);
            for (const identifier in bannedIdentifiers)
                if (bannedIdentifiers[identifier].includes(identifiers[identifier])) reject(ban.reason);
        });
                
        resolve();
    });
}

zFramework.Modules.Ban.Refresh = async function() {
    if (!this.Initialized) return;
    
    await zFramework.Database.Query('SELECT * FROM bans').then(res => {
        if (this.Users !== []) this.Users = [];
        for (let i = 0; i < res.length; i++) this.Users[i] = res[i];
    });
}