onNet("Server.ChangeGender", async genderIndex => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);

    let genderSkin = "mp_m_freemode_01";
    if (genderIndex == 1) genderSkin = "mp_f_freemode_01";

    player.model = genderSkin;
});

onNet("Server.SaveCharacter", async data => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
    if (player.firstSpawn || player.identity && player.skin) return;

    player.identity = data[0];
    player.skin = data[1];
});