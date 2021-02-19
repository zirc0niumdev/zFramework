zFramework.Modules.Initialize = function() {
	for (const moduleName in this.List) {
		if (this[moduleName] && this[moduleName]["Initialize"]) {
			this[moduleName].Initialize();
			console.log(`^3[zFramework] ^7Module ^2${moduleName} ^7initialized.\n`);
		}
	}
}