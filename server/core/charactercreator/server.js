onNet("Server.ChangeGender", function(genderIndex) {
	const player = zFramework.Players[global.source];
    if (!player) return;

    let genderSkin = "mp_m_freemode_01";
    if (genderIndex == 1) genderSkin = "mp_f_freemode_01";

    player.model = genderSkin;
});

onNet("Server.SaveCharacter", function(data) {
	const player = zFramework.Players[global.source];
    if (!player || player.firstSpawn || player.identity && player.skin) return;

    player.identity = data[0];
    player.skin = data[1];
});