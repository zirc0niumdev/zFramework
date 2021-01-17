const fetch = require('node-fetch');
const Discord = {};

on("onResourceStart", (name) => {
	if (GetCurrentResourceName() != name) return;

	console.log("\x1b[33m[zFramework] \x1b[34mDiscord Webhook Started!\x1b[37m");
	discord.SendWebhookMessage(Config.Logging.Webhook.NAME, "**zFramework started!**");
});

Discord.SendWebhookMessage = (title, msg) => {
    if (!Config.Logging.Enable) return;
	
	fetch(Config.Logging.Webhook.URL, {
		method: 'post',
		headers: {
		   'Content-Type': 'application/json'
		},
		body: JSON.stringify({username: title, content: msg, avatar_url: Config.Logging.Webhook.IMG})
	});
};