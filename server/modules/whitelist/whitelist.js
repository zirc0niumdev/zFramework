import CCommands from '../../class/CCommands';

zFramework.Modules.Whitelist.Initialize = function() {
    this.Initialized = true;

    new CCommands("wlrefresh", zFramework.Groups.SUPERADMIN, (player, args, source) => this.Refresh(), {help: "haha"});
    this.Refresh();
}

zFramework.Modules.Whitelist.CheckUser = async function(id) {
    if (!this.Initialized) return;
    
	return new Promise((resolve, reject) => {
        const foundUser = this.Users.find(userId => userId === id);
		if (!foundUser) reject();
		
		resolve(foundUser);
	});
}

zFramework.Modules.Whitelist.Refresh = async function() {
    if (!this.Initialized) return;
    console.log("test");
    await zFramework.DB.Query('SELECT * FROM whitelist').then(res => {
        for (let i = 0; i < res.length; i++) this.Users[i] = res[i].discord;
        console.log(this.Users);
    });
}