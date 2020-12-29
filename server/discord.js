const fetch = require('node-fetch');
const Discord = {};

Discord.Colors = {
	RED: 13632027,
    GREEN: 4289797,
    BLUE: 4886754,
    ORANGE: 16098851,
    BLACK: 1,
    WHITE: 16777215,
    GREY: 10197915,
    YELLOW: 16312092,
    BROWN: 9131818,
    CYAN: 5301186
}

on("onResourceStart", (resourceName) => {
	if (GetCurrentResourceName() != resourceName) return;

	console.log("\x1b[33m[zFramework] \x1b[34mDiscord Webhook Started!\x1b[37m");
	Discord.SendWebhookMessage(Config.Logging.Webhook.NAME, "**zFramework started!**");
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