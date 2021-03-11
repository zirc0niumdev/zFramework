import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(GetResourcePath(GetCurrentResourceName()), './.env') });

zFramework.Modules.Discord.Initialize = function() {
    this.Initialized = true;
}

zFramework.Modules.Discord.SendMessage = async (content) => {
    if (!zFramework.Modules.Discord.Initialized) return;
	
	fetch(process.env.WEBHOOK, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content })
	});
};