const util = require('util');

getDate = () => new Date().toLocaleString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

Delay = (ms) => new Promise((resolve) => {
	const timeout = setTimeout(() => {
		clearTimeout(timeout);
		return resolve();
	}, ms);
});

Capitalize = (s) => typeof s !== "string" ? "" : s.charAt(0).toUpperCase() + s.slice(1);

RandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

NumberToArray = (num) => {
	let array = [];
	for (i=0; i <= num; i++) array.push(i);
	return array;
}

SecondsToClock = (seconds) => {
	seconds = parseInt(seconds);

	if (seconds <= 0) return "00:00";
	else {
		const mins = util.format("%d", Math.floor(seconds / 60));
		const secs = util.format("%d", Math.floor(seconds - mins * 60));
		return util.format("%s:%s", mins, secs);
    }
}

UpdateVar = (varName, varValue) => zFramework.LocalPlayer[varName] = varValue;

onNet("Client.UpdateVar", UpdateVar);
