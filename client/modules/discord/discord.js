zFramework.Modules.Discord.Initialize = function() {
	SetDiscordAppId("682814905166069850");
	SetDiscordRichPresenceAsset("512");
	SetDiscordRichPresenceAssetText("SantosRP");
	SetDiscordRichPresenceAssetSmall("discord_512");
	SetDiscordRichPresenceAssetSmallText("discord.santosrp.fr");
	SetDiscordRichPresenceAction(0, "Rejoindre le discord", "https://discord.santosrp.fr/");
	SetRichPresence(`[${zFramework.LocalPlayer.serverId}] ${`${zFramework.LocalPlayer.identity.firstname} ${zFramework.LocalPlayer.identity.lastname}` || zFramework.LocalPlayer.name}`);
};