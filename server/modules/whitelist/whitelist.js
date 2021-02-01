import CCommands from '../../class/CCommands';

zFramework.Modules.Whitelist.Initialize = function() {
    new CCommands("wlrefresh", zFramework.Groups.SUPERADMIN, (player, args, source) => this.Refresh(), {help: "haha"});
    
    this.Initialized = true;
    this.OnInitialize();
}

zFramework.Modules.Whitelist.OnInitialize = function() {
    this.Refresh();
}

zFramework.Modules.Whitelist.CheckUser = async function(id) {
    if (!this.Initialized) return;
    
	return new Promise((resolve, reject) => {
        const foundUser = this.Users.find(userId => userId === id);
		if (!foundUser) reject("Vous n'êtes pas Whitelist");
		
		resolve(foundUser);
	});
}

zFramework.Modules.Whitelist.Refresh = async function() {
    if (!this.Initialized) return;
    
    await zFramework.Database.Query('SELECT * FROM whitelist').then(res => {
        for (let i = 0; i < res.length; i++) this.Users[i] = res[i].discord;
    });
}