import CCommands from '../../class/CCommands';

zFramework.Modules.Whitelist.Initialize = function() {
    // ADD COMMAND
    new CCommands("wla", zFramework.Groups.ADMIN, async (player, args) => {
        const discordId = args[0];
            
        await zFramework.Database.Query('INSERT INTO `whitelist` (discord) VALUE (?)', discordId).then(async () => {
            await this.Refresh();

            if (player) player.notify(`~b~ID Discord:~s~ ${discordId}\nWHITELIST.`);
            console.log(`ID Discord: ${discordId}\nWHITELIST.`);
        });
    
    }, {help: "haha"});
    
    // DELETE COMMAND
    new CCommands("wld", zFramework.Groups.ADMIN, async (player, args) => {
        const discordId = args[0];
        const foundUser = this.Users.find(discord => discord === discordId);

        if (foundUser) {
            await zFramework.Database.Query('DELETE FROM `whitelist` WHERE `discord` = ?', discordId).then(async () => {
                if (player) player.notify(`~b~ID Discord:~s~ ${discordId}\nUNWHITELIST.`);
                console.log(`ID Discord: ${discordId}\nUNWHITELIST.`);

                await this.Refresh();
            });
        } else {
            if (player) player.notify("~r~Cet utilisateur n'est pas whitelist.");
            console.log("Cet utilisateur n'est pas whitelist.");
        }
    }, {help: "haha"});
    
    this.Initialized = true;
    this.OnInitialize();
}

zFramework.Modules.Whitelist.OnInitialize = function() {
    this.Refresh();
}

zFramework.Modules.Whitelist.CheckUser = async function(id) {
    if (!this.Initialized) return;
    
	return new Promise((resolve, reject) => {
        const foundUser = this.Users.find(discord => discord === id);
		if (!foundUser) reject("Vous n'êtes pas Whitelist");
		
		resolve(foundUser);
	});
}

zFramework.Modules.Whitelist.Refresh = async function() {
    if (!this.Initialized) return;
    
    await zFramework.Database.Query('SELECT * FROM whitelist').then(res => {
        if (this.Users !== []) this.Users = [];
        for (let i = 0; i < res.length; i++) this.Users[i] = res[i].discord;
    });
}