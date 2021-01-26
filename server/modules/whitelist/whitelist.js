import whitelist from '../../../config/whitelist.json'

zFramework.Modules.Whitelist.Initialize = function() {
    // Stuff goes here... 

    this.Initialized = true;
}

zFramework.Modules.Whitelist.CheckUser = async function(id) {
    if (!this.Initialized) return;
    
	return new Promise((resolve, reject) => {
        const foundUser = whitelist.find(userId => userId === id);
		if (!foundUser) reject();
		
		resolve(foundUser);
	});
}