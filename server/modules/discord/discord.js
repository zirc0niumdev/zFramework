const fetch = require('node-fetch');

zFramework.Modules.Discord.Initialize = function() {
    this.Initialized = true;
}

zFramework.Modules.Discord.SendWebhookMessage = (username, content) => {
    if (!zFramework.Modules.Discord.Initialized) return;
	
	// change this to proccess.env
	fetch(Config.Logging.Webhook.URL, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, content, avatar_url: Config.Logging.Webhook.IMG })
	});
};