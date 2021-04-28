import * as NativeUI from "../../class/menu/nativeui.js";

let menuData = {};

const parentsName = [
    "Benjamin",
    "Daniel",
    "Joshua",
    "Ryry",
    "Andrew",
    "Juan",
    "Alex",
    "Isaac",
    "Evan",
    "Ethan",
    "Vincent",
    "Angel",
    "Diego",
    "Adrian",
    "Gabriel",
    "Michael",
    "Santiago",
    "Kevin",
    "Louis",
    "Samuel",
    "Anthony",
    "Latina",
    "Audrey",
    "Jasmine",
    "Giselle",
    "Amelia",
    "Isabella",
    "Zoe",
    "Ava",
    "Camilia",
    "Violet",
    "Sophie",
    "Evelyn",
    "Nicole",
    "Ashley",
    "Grace",
    "Briana",
    "Natalie",
    "Olivia",
    "Elizabeth",
    "Charlotte",
    "Emma",
    "Claude",
    "Niko",
    "John",
    "Misty"
];

const outfits = {
  0: [
    {
        name: "Nu",
        set: {}
    },
    {
      name: "Bronzage",
      set: {
        c: { 3: [5], 4: [6, 2], 6: [5], 8: [15], 11: [5, 7] },
        p: { 1: [7, 3] },
      },
    },
    {
      name: "Mauvais goût",
      set: {
        c: { 3: [5], 4: [12], 6: [6], 8: [15], 11: [5] },
        p: { 0: [4, 1], 1: [2] },
      },
    },
    {
      name: "Négligé",
      set: {
        c: { 3: [0], 4: [5], 6: [43, 7], 8: [15], 11: [0, 2] },
        p: { 1: [2] },
      },
    },
    {
      name: "Ordinaire",
      set: {
        c: { 3: [1], 4: [2, 11], 6: [7], 8: [0, 2], 11: [3] },
        p: { 0: [4, 1], 1: [2] },
      },
    },
    {
      name: "Couvert",
      price: 725,
      set: { c: { 3: [1], 4: [15], 6: [1], 8: [15], 11: [57] } },
    },
    {
      name: "Sportif",
      set: {
        c: { 3: [1], 4: [3, 15], 6: [31], 8: [1, 3], 11: [3, 15] },
        p: { 1: [10, 11] },
      },
    },
    {
      name: "Skater",
      set: {
        c: { 3: [1], 4: [8], 6: [9, 1], 8: [15], 11: [14, 11] },
        p: { 0: [2, 4], 1: [9, 4] },
      },
    },
    {
      name: "Rebelle",
      set: {
        c: { 3: [1], 4: [1], 6: [15], 8: [2, 2], 11: [6, 1] },
        p: { 1: [6] },
      },
    },
    {
      name: "Hipster",
      set: {
        c: { 3: [1], 4: [8], 6: [14, 8], 8: [2, 7], 11: [6, 11] },
        p: { 0: [7, 5], 1: [8] },
      },
    },
    {
      name: "Noctambule",
      set: {
        c: { 3: [1], 4: [4], 6: [14, 15], 8: [0, 4], 11: [4, 2] },
        p: { 1: [8, 6] },
      },
    },
    {
      name: "L'icône",
      set: {
        c: { 3: [1], 4: [4, 1], 6: [10, 12], 8: [12, 10], 11: [4] },
        p: { 1: [10, 3] },
      },
    },
    {
      name: "Homme de main",
      set: {
        c: { 3: [1], 4: [10], 6: [21], 7: [23, 7], 8: [10, 10], 11: [-30] },
      },
    },
    {
      name: "Travailleur",
      set: { c: { 4: [9], 11: [-32, 3], 6: [25], 3: [11] } },
    },
    {
      name: "Chill",
      set: { c: { 8: [32], 3: [4], 4: [4, 1], 6: [12, 3], 11: [-43] } },
    },
    {
      name: "Aaron",
      set: { c: { 8: [10], 3: [8], 4: [4, 1], 6: [14, 15], 11: [-63] } },
    },
    { name: "Cli", set: { c: { 4: [4], 11: [-64], 6: [14, 15], 3: [6] } } },
    {
      name: "Abdi",
      set: { c: { 8: [23, 1], 3: [6], 4: [-30], 6: [24], 11: [-66] } },
    },
    { name: "Chill 2", set: { c: { 4: [4, 2], 11: [-68], 6: [2], 3: [6] } } },
  ],
  1: [
    { name: "Nue", set: {} },
    {
      name: "Couvert",
      set: { c: { 3: [1], p: [4], c: [8], 8: [23], 11: [65] } },
    },
    {
      name: "1980s",
      set: { c: { 3: [4], p: [14], c: [19], 8: [34], 11: [115] } },
    },
    {
      name: "Rosie",
      set: { c: { 3: [0], p: [4], c: [3], 8: [34], 11: [27] } },
    },
    {
      name: "Jogging",
      set: { c: { 3: [4], p: [10], c: [32], 8: [34], 11: [118] } },
    },
    {
      name: "Style 01",
      set: { c: { 3: [11], 11: [44], 4: [16], 6: [0, 3], 8: [34] } },
    },
    {
      name: "Style 02",
      set: { c: { 3: [3], 11: [52], 4: [16], 6: [9], 8: [15] } },
    },
    {
      name: "Style 03",
      set: { c: { 3: [4], 11: [147, 11], 4: [54, 2], 6: [77, 6], 8: [7] } },
    },
    {
      name: "Style 04",
      set: { c: { 3: [0], 11: [158], 4: [44], 6: [24], 8: [44, 1] } },
    },
    {
      name: "Baronne",
      set: { c: { 3: [14], 11: [124], 4: [65], 6: [77], 8: [14], 7: [88] } },
    },
  ],
};

function getModels() {
    const newModels = [];
    const models = zFramework.Core.Cloth.Models;
    models.forEach((name, index) => {
        newModels.push({
            name,
            index
        });
    });
    return newModels;
}

let creatorCam;
let isCreating = false;
const creatorCoords = { x: 402.96, y: -996.87, z: -100.0, h: 180.0 };
const controlsToKeepEnable = [24, 189, 190, 187, 188, 202, 239, 240, 201, 172, 173, 174, 175];

/* Creator */
const creatorMenu = new NativeUI.Menu("Nouveau personnage", "Menu principal", new NativeUI.Point(50, 50), null, null, false);
const charListItem = new NativeUI.UIMenuItem("Liste des personnages");
const parentsItem = new NativeUI.UIMenuItem("Héritage");
const apparenceItem = new NativeUI.UIMenuItem("Apparence");
const maqItem = new NativeUI.UIMenuItem("Maquillage");
const traitsItem = new NativeUI.UIMenuItem("Traits du visage");
const variationsItem = new NativeUI.UIMenuItem("Variations");
variationsItem.Enabled = false;
const idItem = new NativeUI.UIMenuItem("Identité");
const confirmItem = new NativeUI.UIMenuItem("Confirmer");
confirmItem.BackColor = new NativeUI.Color(0, 200, 0);
confirmItem.HighlightedBackColor = new NativeUI.Color(0, 160, 0);
creatorMenu.AddItems([charListItem, parentsItem, apparenceItem, maqItem, traitsItem, variationsItem, idItem, confirmItem]);

/* Character List */
const charListMenu = new NativeUI.Menu(creatorMenu.Title, "Liste des personnages", new NativeUI.Point(50, 50));
creatorMenu.AddSubMenu(charListMenu, charListItem);

charListMenu.ItemSelect.on(async (selectedItem) => {
    const { isPed } = zFramework.LocalPlayer;
    const id = selectedItem.Data;
    const models = zFramework.Core.Cloth.Models;
    const model = models[id];
    const sex = id > 1 && 2 || id;

    zFramework.LocalPlayer.sex = sex;
    menuData.sex = sex;
    menuData.model = model;
    variationsMenu.Clear();

    await changeModel(model);
    resetParents();
    
    if (isPed()) {
        const { pedId } = zFramework.LocalPlayer;
        for (let drawable=0; drawable < 12; drawable++) {
            const maxVariations = GetNumberOfPedDrawableVariations(pedId, drawable) - 1;
            maxVariations > 0 && variationsMenu.AddItem(new NativeUI.UIMenuSliderItem(`Variation ${drawable + 1}`, NumberToArray(maxVariations), 0, "", true, drawable));
        }
    }
    
    variationsItem.Enabled = isPed() && variationsMenu.MenuItems.length > 0 && true || false;
    parentsItem.Enabled = !isPed();
    apparenceItem.Enabled = !isPed();
    maqItem.Enabled = !isPed();
    traitsItem.Enabled = !isPed();
});

/* Parents */
const parentsMenu = new NativeUI.Menu(creatorMenu.Title, "Héritage", new NativeUI.Point(50, 50));
const fatherItem = new NativeUI.UIMenuListItem("Parent 1", "", new NativeUI.ItemsCollection(parentsName));
const motherItem = new NativeUI.UIMenuListItem("Parent 2", "", new NativeUI.ItemsCollection(parentsName), 21);
const similarityItem = new NativeUI.UIMenuSliderItem("Ressemblance", NumberToArray(100), 0, "", true);
const skinSimilarityItem = new NativeUI.UIMenuSliderItem("Couleur de peau", NumberToArray(100), 0, "", true);
parentsMenu.AddItems([fatherItem, motherItem, similarityItem, skinSimilarityItem]);
creatorMenu.AddSubMenu(parentsMenu, parentsItem);

parentsMenu.SliderChange.on(() => changeParents([fatherItem.Index, motherItem.Index, similarityItem.Index, skinSimilarityItem.Index]));
parentsMenu.ListChange.on(() => changeParents([fatherItem.Index, motherItem.Index, similarityItem.Index, skinSimilarityItem.Index]));

/* Appaerence */
const apparenceMenu = new NativeUI.Menu(creatorMenu.Title, "Apparence", new NativeUI.Point(50, 50));
creatorMenu.AddSubMenu(apparenceMenu, apparenceItem);

/* Variations */
const variationsMenu = new NativeUI.Menu(creatorMenu.Title, "Variations", new NativeUI.Point(50, 50));
creatorMenu.AddSubMenu(variationsMenu, variationsItem);

variationsMenu.SliderChange.on((selectedItem, selectedIndex, sliderIndex) => {
    const { pedId } = zFramework.LocalPlayer;
    SetPedComponentVariation(pedId, selectedItem.Data, sliderIndex, 0, 2);
});

/* Identity */
const days = [];
const years = [];
for (let day = 1; day <= 31; day++) days.push(day);
for (let year = 1950; year <= 2003; year++) years.push(year);

const idMenu = new NativeUI.Menu(creatorMenu.Title, "Identité", new NativeUI.Point(50, 50));
const firstnameItem = new NativeUI.UIMenuItem("Prénom", "", "???");
const lastnameItem = new NativeUI.UIMenuItem("Nom", "", "???");
const birthplaceItem = new NativeUI.UIMenuItem("Lieu de naissance", "", "Los Santos");
const birthDayItem = new NativeUI.UIMenuListItem("Jour de naissance", "", new NativeUI.ItemsCollection(days));
const birthMonthItem = new NativeUI.UIMenuListItem("Mois de naisassnce", "",
    new NativeUI.ItemsCollection([
        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
    ])
);
const birthYearItem = new NativeUI.UIMenuListItem("Année de naissance", "", new NativeUI.ItemsCollection(years));
idMenu.AddItems([firstnameItem, lastnameItem, birthplaceItem, birthDayItem, birthMonthItem, birthYearItem]);
creatorMenu.AddSubMenu(idMenu, idItem);

idMenu.ItemSelect.on(async (selectedItem, selectedIndex) => {
    switch(selectedIndex) {
        case 0:
        case 1:
        case 2:
            selectedItem.SetRightLabel(Capitalize(await zFramework.Functions.KeyboardInput(selectedItem.Text, selectedItem.RightLabel, 15)));
            break;
    }
});

const camDefaultPos = { x: 402.96, y: -996.87, z: -99.0, h: 180.0};
NativeUI.MenuChange.on((newMenu, enteredSubMenu) => {
    const { pedId } = zFramework.LocalPlayer;
    const entityOpposite = camDefaultPos.h * Math.PI / 180.0;
    
    if (newMenu.Id == creatorMenu.Id) {
        SetCamCoord(creatorCam, camDefaultPos.x - 1.5 * Math.sin(entityOpposite), camDefaultPos.y + 1.5 * Math.cos(entityOpposite), camDefaultPos.z + .5);
        SetCamRot(creatorCam, .0, .0, 270.0, 2);
        PointCamAtEntity(creatorCam, pedId, .0, .0, .0, true);
    } else if (newMenu.Id == parentsMenu.Id) {
        SetCamCoord(creatorCam, camDefaultPos.x - .4 * Math.sin(entityOpposite), camDefaultPos.y + .4 * Math.cos(entityOpposite), camDefaultPos.z + .68);
        PointCamAtEntity(creatorCam, pedId, .0, .0, .7, true);
    }
});

creatorMenu.MenuOpen.on(async () => {
    const { pedId } = zFramework.LocalPlayer;
    zFramework.LocalPlayer.cinemaMode = 2;
    zFramework.LocalPlayer.busy = 2;
    RequestStreamedTextureDict("pause_menu_pages_char_mom_dad", false);
    RequestStreamedTextureDict("char_creator_portraits", false);
    RequestStreamedTextureDict("mpleaderboard", false);
    RequestStreamedTextureDict("mpinventory", false);
    await zFramework.Functions.RequestDict("MP_HEAD_IK_OVERRIDE");
    const intId = GetInteriorAtCoordsWithType(399.9, -998.7, -100.0, "v_mugshot");
    LoadInterior(intId);
    RequestInteriorRoomByName(intId, GetHashKey("v_mugshot"));
    RequestInteriorRoomByName(intId, GetHashKey("V_WinningRoom"));
    await Delay(1000);
    DoScreenFadeIn(1000);
    ForceRoomForEntity(pedId, intId, GetHashKey("v_mugshot"));
    ForceRoomForEntity(pedId, intId, GetHashKey("V_WinningRoom"));
    startCreator();
});

creatorMenu.MenuClose.on(() => {
    const { pedId } = zFramework.LocalPlayer;
    SetStreamedTextureDictAsNoLongerNeeded("pause_menu_pages_char_mom_dad", false);
    SetStreamedTextureDictAsNoLongerNeeded("char_creator_portraits", false);
    SetStreamedTextureDictAsNoLongerNeeded("mpleaderboard", false);
    SetStreamedTextureDictAsNoLongerNeeded("pause_menu_pages_char_mom_dad", false);
    SetStreamedTextureDictAsNoLongerNeeded("mpinventory", false);
    RemoveAnimDict("MP_HEAD_IK_OVERRIDE");
    if (DoesCamExist(creatorCam)) {
        DestroyCam(creatorCam);
        RenderScriptCams(false, true, 500, false, false);
    }
    FreezeEntityPosition(pedId, false);
    SetBlockingOfNonTemporaryEvents(pedId, false);
    StopAnimTask(pedId, "MP_HEAD_IK_OVERRIDE", "MP_CREATOR_HEADIK", 4.0);
    zFramework.LocalPlayer.busy = 0;
    zFramework.LocalPlayer.cinemaMode = 0;
    UnpinInterior(GetInteriorAtCoordsWithType(399.9, -998.7, -100.0, "v_mugshot"));
});

async function startCreator() {
    isCreating = true;
    DestroyAllCams();
    const { pedId } = zFramework.LocalPlayer;
    SetEntityCoords(pedId, creatorCoords.x, creatorCoords.y, creatorCoords.z);
    SetEntityHeading(pedId, creatorCoords.h + .0);
    FreezeEntityPosition(pedId, true);
    SetBlockingOfNonTemporaryEvents(pedId, true);
    SetPedKeepTask(pedId, true);
    zFramework.LocalPlayer.invincible = true;
    TaskPlayAnim(pedId, "MP_HEAD_IK_OVERRIDE", "MP_CREATOR_HEADIK", 1000.0, -1000.0, -1, 289, 0, 0, 0, 0);
    await changeModel("mp_m_freemode_01");
    await Delay(10);
    creatorCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);
    SetCamRot(creatorCam, .0, .0, 270.0, true);
    {
        const { pedId, getLocation } = zFramework.LocalPlayer;
        const entityHeading = GetEntityHeading(pedId);
        const entityOpposite = entityHeading * Math.PI / 180.0;
        SetCamCoord(creatorCam, getLocation().x - 1.5 * Math.sin(entityOpposite), getLocation().y + 1.5 * Math.cos(entityOpposite), getLocation().z + .5);
        SetCamRot(creatorCam, .0, .0, 270.0, 2);
        PointCamAtEntity(creatorCam, pedId, .0, .0, .0, true);
    }
    SetCamActive(creatorCam, true);
    RenderScriptCams(1, 0, 500, 1, 0);

    while (isCreating) {
        await Delay(0);

        DisableAllControlActions(0);
        for (const control of controlsToKeepEnable) EnableControlAction(0, control, true);

        const { pedId } = zFramework.LocalPlayer;
        for (const targetId of GetActivePlayers()) {
            const targetPed = GetPlayerPed(targetId);
            if (DoesEntityExist(targetPed) && targetPed != pedId) DeletePed(targetPed);
        }

        SetPedDensityMultiplierThisFrame(.0);
        SetVehicleDensityMultiplierThisFrame(.0);
        NetworkSetTalkerProximity(0.01);
        SetParkedVehicleDensityMultiplierThisFrame(.0);
    }
}

async function changeModel(model) {
    await zFramework.Functions.SetModel(model);
    const { pedId } = zFramework.LocalPlayer;
    FreezePedCameraRotation(pedId);
    TaskSetBlockingOfNonTemporaryEvents(pedId, true);
    SetPedDefaultComponentVariation(pedId);
    zFramework.LocalPlayer.invincible = true;
    changeOutfit(0);
    zFramework.LocalPlayer.freeze = true;
    TaskPlayAnim(pedId, "MP_HEAD_IK_OVERRIDE", "MP_CREATOR_HEADIK", 1000.0, -1000.0, -1, 289, 0, 0, 0, 0);
    menuData.blendData = [];
}

function resetParents() {
    fatherItem.Index = 0;
    motherItem.Index = 21;
    similarityItem.Index = 0;
    skinSimilarityItem.Index = 0;

    parentsMenu.RefreshIndex();
}

function changeOutfit(outfitId) {
    const { sex } = zFramework.LocalPlayer;
    const outfit = outfits[sex] && outfits[sex][outfitId];
    if (!outfit) return;
    menuData.outfit = outfit;
    zFramework.Core.Cloth.SetSkin(outfit.set, { bl: true });
}

function changeParents(parents) {
    const { pedId } = zFramework.LocalPlayer;
    const shapeMix = parseFloat(parents[2]), skinMix = parseFloat(parents[3]);
    let shapeFirstId = parents[0], shapeSecondId = parents[1], shapeThirdId = 0, skinFirstId = 0, skinSecondId = 0, skinThirdId = 0, thirdMix = .0, isParent = false; 
    skinFirstId = shapeFirstId, skinSecondId = shapeSecondId;

    menuData.blendData = [
        shapeFirstId || 0,
        shapeSecondId || 0,
        shapeThirdId || 0,
        skinFirstId || 0,
        skinSecondId || 0,
        skinThirdId || 0,
        shapeMix || .0,
        skinMix || .0,
        thirdMix || .0,
    ];

    SetPedHeadBlendData(
        pedId,
        shapeFirstId || 0,
        shapeSecondId || 0,
        shapeThirdId || 0,
        skinFirstId || 0,
        skinSecondId || 0,
        skinThirdId || 0,
        shapeMix || .0,
        skinMix || .0,
        thirdMix || .0,
        isParent
    );
}

zFramework.Core.CharacterCreator.Open = () => !creatorMenu.Opened && creatorMenu.Open();

zFramework.Core.CharacterCreator.Initialize = () => {
    // Register Models
    getModels().map(model => charListMenu.AddItem(new NativeUI.UIMenuItem(model.name, "", "", model.index)));
    
    // Register Appearance 
    const hairItem = new NativeUI.UIMenuListItem("Cheveux", "", new NativeUI.ItemsCollection(zFramework.Core.Cloth.Hairs[0].map(h => h.name)), null, { c: 2 });
    // const eyebrowsItem = new NativeUI.UIMenuListItem("Sourcils", "", new NativeUI.ItemsCollection(), null, { h: 2 });
    apparenceMenu.AddItems([hairItem]);
    
    apparenceMenu.ListChange.on(() => changeParents([fatherItem.Index, motherItem.Index, similarityItem.Index, skinSimilarityItem.Index]));
}

zFramework.Core.CharacterCreator.Think = () => {    
    if (UpdateOnscreenKeyboard() == 0) return;

    if (creatorMenu.Opened) {
        const leftButton = IsDisabledControlPressed(1, 44), rightButton = IsDisabledControlPressed(1, 51);
        if (leftButton || rightButton) {
        const { pedId } = zFramework.LocalPlayer;
            SetEntityHeading(pedId, leftButton && GetEntityHeading(pedId) - 1.0 || rightButton && GetEntityHeading(pedId) + 1.0);
        }
    }
}