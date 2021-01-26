Delay = (ms) => new Promise((res) => setTimeout(res, ms));

Capitalize = (s) => typeof s !== "string" ? "" : s.charAt(0).toUpperCase() + s.slice(1);

RandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

UpdateVar = (varName, varValue) => zFramework.LocalPlayer[varName] = varValue;

onNet("Client.UpdateVar", UpdateVar);
