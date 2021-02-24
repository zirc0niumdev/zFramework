const animsSettings = [
    {
        dict: "mp_player_inteat@burger",
        intro: "mp_player_int_eat_burger_enter",
        loop: "mp_player_int_eat_burger",
        outro: "mp_player_int_eat_exit_burger",
        sound: "Knuckle_Crack_Soft"
    },
    {
        dict: "mp_player_inteat@pnq",
        intro: "intro",
        loop: "loop",
        outro: "outro",
        sound: "Slow_Clap_Cel"
    },
    {
        dict: "mp_player_intdrink",
        intro: "intro_bottle",
        loop: "loop_bottle",
        outro: "outro_bottle",
        sound: "Bottle_Initial"
    },
    {
        dict: "mp_player_intdrink",
        intro: "intro",
        loop: "loop",
        outro: "outro",
        sound: "Can_Gulp"
    }
]

async function createProp(prop, anim){
    const { pedId, getLocation } = zFramework.LocalPlayer;
    const anims = animsSettings[anim];

    await zFramework.Functions.RequestModel(prop);
    await zFramework.Functions.RequestDict(anims.dict);

    zFramework.Functions.TaskSynchronizedTasks(pedId, [{ anim: [anims.dict, anims.intro], flag: 48 }, { anim: [anims.dict, anims.loop], flag: 49 }]);

    await Delay(50);

    const handle = CreateObjectNoOffset(GetHashKey(prop), getLocation(), false, false, false);
    AttachEntityToEntity(
        handle,
        pedId,
        GetPedBoneIndex(pedId, 60309),
        .0,
        .0,
        .0,
        .0,
        .0,
        .0,
        true,
        true,
        false,
        true,
        1,
        true
    );

    await Delay(4000);
    zFramework.Functions.TaskSynchronizedTasks(pedId, [{ anim: [anims.dict, anims.loop], flag: 48 }, { anim: [anims.dict, anims.outro], flag: 48 }]);
    if (anim <= 2) DeleteEntity(handle);
    await Delay((GetAnimDuration(anims.dict, anims.outro) * 1000) - 100);
    if (anim > 2) DeleteEntity(handle);
}

const itemAnims = {
    // ["Hamburger"]: { anim: 1, prop: "prop_cs_burger_01" },
    ["drinkItem"]: { anim: 2 },
    ["eatItem"]: { anim: 2 },
    ["Eau de source"]: { anim: 3, prop: "prop_ld_flow_bottle" },
    // ["Soda"]: { anim: 4, prop: "prop_ecola_can" },
    // ["Donut"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_donut_02" },
    // ["Viande crue"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Chocolat"]: { anim: 1, prop: "prop_choc_ego" },
    ["Snickers"]: { anim: 1, prop: "prop_choc_ego" },
    // ["Bière sans alcool"]: { anim: 3, prop: "prop_amb_beer_bottle" },
    // ["Bière"]: { anim: 3, prop: "prop_amb_beer_bottle" },
    // ["Champagne"]: { anim: 3, prop: "prop_drink_whtwine" },
    // ["Magnum"]: { anim: 3, prop: "prop_vodka_bottle" },
    // ["Cocktail"]: { anim: 3, prop: "prop_cocktail" },
    // ["Tequila"]: { anim: 3, prop: "prop_tequila" },
    // ["Whisky"]: { anim: 3, prop: "prop_drink_whisky" },
    // ["Bourbon"]: { anim: 3, prop: "prop_whiskey_bottle" },
    // ["Tapas"]: { anim: 1, prop: "prop_taco_01" },
    // ["Hot-dog"]: { anim: 2, prop: "prop_cs_hotdog_01" },
    // ["Chips"]: { anim: 2, prop: "prop_choc_pq" },
    // ["Vin"]: { anim: 3, prop: "prop_wine_bot_01" },
    // ["Café"]: { anim: "WORLD_HUMAN_AA_COFFEE", time: 10000 },
    // ["Thé vert"]: { anim: 3, prop: "v_res_fa_pottea" },
    // ["Jus de Leechi"]: { anim: 3, prop: "p_w_grass_gls_s" },
    // ["Maki"]: { anim: 1, prop: "prop_food_cb_burg02" },
    // ["Bol de nouilles"]: { anim: 2, prop: "prop_ff_noodle_01" },
    // ["Assiette de sushis"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_plate_01" },
    // ["Rouleau de printemps"]: { anim: 1, prop: "prop_taco_02" },
    // ["Soupe de nouille"]: { anim: 2, prop: "v_ret_247_noodle1" },
    ["Pain"]: { anim: 1, prop: "v_ret_247_bread1" },
    // ["Saumon frais"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Cannabis"]: { anim: ["WORLD_HUMAN_SMOKING_POT"], time: -1 },
    // ["Cocaïne"]: { anim: ["missfbi3_party", "snort_coke_b_male3"], time: -1 },
    // ["Méthamphétamine"]: { anim: ["WORLD_HUMAN_SMOKING_POT"], time: -1 },
    // ["Cigarette"]: { anim: ["WORLD_HUMAN_SMOKING"], time: -1 },
    // ["Truite arc-en-ciel"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Kokanee"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Ombre de getLocation()'arctique"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Perche rock"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Petite bouche"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Grande bouche"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Truite bull"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Truite de lac"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Chinook"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Esturgeon pâle"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Spatules"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Gardon"]: { anim: ["amb@code_human_wander_eating_donut@male@idle_a", "idle_c"], prop: "prop_cs_steak" },
    // ["Frites"]: { anim: 2, prop: "prop_food_cb_chips" },
    // ["Fricadelle"]: { anim: 2, prop: "prop_food_cb_chips" },
    // ["getLocation()'américain"]: { anim: 2, prop: "prop_cs_burger_01" },
    // ["Ch'ti burger"]: { anim: 2, prop: "prop_cs_burger_01" },
    // ["Kebab"]: { anim: 2, prop: "prop_food_bs_burger2" },
    // ["Tender"]: { anim: 2, prop: "ng_prop_food_bag01a" },
    // ["Jupiler"]: { anim: 3, prop: "prop_beer_jakey" },
    // ["Triple bière"]: { anim: 3, prop: "prop_beer_logger" }
}

zFramework.Core.Needs.Eat = async (item, name) => {
    const itemAnim = itemAnims[name] || itemAnims[item.onUse];

    if (typeof(itemAnim.anim) === "number") createProp(itemAnim.prop || "prop_cs_burger_01", itemAnim.anim);
    else {
        const time = !itemAnim.time && 6000 || itemAnim.time > 0 && itemAnim || null;
        zFramework.Functions.PlayAnim(itemAnim.anim, time, 48);

        if (itemAnim.prop) {
            await Delay(750);
            zFramework.Functions.AttachObjectPedHand(itemAnim.prop, 4000);
            await Delay(750);
        } else if (!itemAnim.time || itemAnim.time > 0)
            await Delay(itemAnim.time || 5000);
        else if (!itemAnim.anim[1]) {
            await Delay(1000);
            while (IsPedUsingScenario(zFramework.LocalPlayer.pedId, itemAnim.anim[0])) await Delay(1000);
        }
    }

    if (item.hunger || item.thirst) {
        // send hunger
        // send thirst
    }
}