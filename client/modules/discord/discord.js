zFramework.Modules.Discord.Initialize = function() {
	SetDiscordAppId("682814905166069850");
	SetDiscordRichPresenceAsset("512");
	SetDiscordRichPresenceAssetText("SantosRP");
	SetDiscordRichPresenceAssetSmall("discord_512");
	SetDiscordRichPresenceAssetSmallText("discord.santosrp.fr");
	this.SetRichPresence(`[${GetPlayerServerId(zFramework.LocalPlayer.playerId)}] ${`${zFramework.LocalPlayer.identity.firstname} ${zFramework.LocalPlayer.identity.lastname}` || zFramework.LocalPlayer.name}`);
    this.Initialized = true;
};

zFramework.Modules.Discord.SetRichPresence = status => SetRichPresence(status);