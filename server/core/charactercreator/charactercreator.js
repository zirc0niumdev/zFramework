onNet("Server.ChangeGender", async genderIndex => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
    const genderSkin = genderIndex == 1 && "mp_f_freemode_01" || "mp_m_freemode_01";

    player.clientEvent("Client.SetModel", genderSkin);
});

onNet("Server.SaveCharacter", async data => {
	const player = await zFramework.Functions.GetPlayerFromId(global.source);
    if (!player.firstSpawn || player.character) return;

    player.character = data;
});