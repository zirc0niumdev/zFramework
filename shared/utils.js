/**
* @param {number} ms
*/
Delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
* @param {string} varName @param {any} varValue
*/
UpdateVar = (varName, varValue) => zFramework.LocalPlayer[varName] = varValue;
onNet("Client.UpdateVar", UpdateVar);

Capitalize = (s) => {return typeof(s) !== 'string' ? '' : s.charAt(0).toUpperCase() + s.slice(1)};
RandomInt = (min, max) => {return Math.floor(Math.random() * (max - min + 1)) + min};