zFramework.Modules.Discord.Initialize = function() {
	SetDiscordAppId("682814905166069850");
	SetDiscordRichPresenceAsset("512");
	SetDiscordRichPresenceAssetText("SantosRP");
	SetDiscordRichPresenceAssetSmall("discord_512");
	SetDiscordRichPresenceAssetSmallText("discord.santosrp.fr");
	this.SetRichPresence("test");
    this.Initialized = true;
};

zFramework.Modules.Discord.SetRichPresence = status => SetRichPresence(status);