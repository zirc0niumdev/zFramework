zFramework.Core = {};

zFramework.Core.List = {
    Inventory: true,
    Needs: true
};

zFramework.Core.Initialize = function() {
	for (const moduleName in this.List) {
		if (this[moduleName] && this[moduleName]["Initialize"]) {
			this[moduleName].Initialize();
			console.log(`^3[zFramework] ^7Core Module ^2${moduleName} ^7initialized.\n`);
		}
	}
}

zFramework.Core.Think = function() {
	for (const moduleName in this.List) {
		if (this[moduleName] && this[moduleName]["Think"]) this[moduleName].Think();
	}
}