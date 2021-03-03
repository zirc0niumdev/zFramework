import * as NativeUI from "../../class/menu/nativeui.js";
import * as Data from "./data.js";

const Menu = NativeUI.Menu;
const UIMenuItem = NativeUI.UIMenuItem;
const UIMenuListItem = NativeUI.UIMenuListItem;
const Point = NativeUI.Point;
const ItemsCollection = NativeUI.ItemsCollection;
const Color = NativeUI.Color;

function updateParents() {
    SetPedHeadBlendData(zFramework.LocalPlayer.pedId, Data.mothers[motherItem.Index], Data.fathers[fatherItem.Index], 0, Data.mothers[motherItem.Index], Data.fathers[fatherItem.Index], 0, similarityItem.Index * 0.01, skinSimilarityItem.Index * 0.01, 0.0, false);
}

function updateFaceFeature(index) {
    SetPedFaceFeature(zFramework.LocalPlayer.pedId, index, parseFloat(featureItems[index].SelectedValue));
}

function updateAppearance(overlayID) {
    let index = (appearanceItems[overlayID].Index == 0) ? 255 : appearanceItems[overlayID].Index - 1;
    SetPedHeadOverlay(zFramework.LocalPlayer.pedId, overlayID, index, appearanceOpacityItems[overlayID].Index * 0.01);
}

function updateHairAndColors() {
    SetPedHairColor(zFramework.LocalPlayer.pedId, hairColorItem.Index, hairHighlightItem.Index);
    SetPedEyeColor(zFramework.LocalPlayer.pedId, eyeColorItem.Index);
    SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 1, 1, beardColorItem.Index, 0);
    SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 2, 1, eyebrowColorItem.Index, 0);
    SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 5, 2, blushColorItem.Index, 0);
    SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 8, 2, lipstickColorItem.Index, 0);
    SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 10, 1, chestHairColorItem.Index, 0);
}

function resetParentsMenu(refresh = false) {
    fatherItem.Index = 0;
    motherItem.Index = 0;
    similarityItem.Index = (currentGender == 0) ? 100 : 0;
    skinSimilarityItem.Index = (currentGender == 0) ? 100 : 0;

    updateParents();
    if (refresh) creatorParentsMenu.RefreshIndex();
}

function resetFeaturesMenu(refresh = false) {
    for (let i = 0; i < Data.featureNames.length; i++) {
        featureItems[i].Index = 100;
        updateFaceFeature(i);
    }

    if (refresh) creatorFeaturesMenu.RefreshIndex();
}

function resetAppearanceMenu(refresh = false) {
    hairItem.Index = 0;
    SetPedComponentVariation(zFramework.LocalPlayer.pedId, 2, Data.hairList[currentGender][hairItem.Index].ID, 0, 2);
    for (let i = 0; i < Data.appearanceNames.length; i++) {
        appearanceItems[i].Index = 0;
        appearanceOpacityItems[i].Index = 100;
        updateAppearance(i);
    }

    if (refresh) creatorAppearanceMenu.RefreshIndex();
}

function resetHairAndColorsMenu(refresh = false) {
    hairColorItem.Index = 0;
    hairHighlightItem.Index = 0;
    eyebrowColorItem.Index = 0;
    beardColorItem.Index = 0;
    eyeColorItem.Index = 0;
    blushColorItem.Index = 0;
    lipstickColorItem.Index = 0;
    chestHairColorItem.Index = 0;
    updateHairAndColors();

    if (refresh) creatorHairMenu.RefreshIndex();
}

let currentGender = 0;

// color arrays
let hairColors = [];
for (let i = 0; i < Data.maxHairColor; i++) hairColors.push(i.toString());

let blushColors = [];
for (let i = 0; i < Data.maxBlushColor; i++) blushColors.push(i.toString());

let lipstickColors = [];
for (let i = 0; i < Data.maxLipstickColor; i++) lipstickColors.push(i.toString());

// CREATOR MAIN
const creatorMainMenu = new Menu("Char Creator", "Créer ton personnage", new Point(50, 50));
creatorMainMenu.SetCloseableByUser(false);

const genderItem = new UIMenuListItem("Genre", "~y~Changer ceci réinitialisera votre personnage", new ItemsCollection(["Homme", "Femme"]));
const parentsItem = new UIMenuItem("Parents", "Parents de votre personnage");
const traitsItem = new UIMenuItem("Traits du visage", "Traits de votre personnage");
const apparenceItem = new UIMenuItem("Apparence", "Apparence de votre personnage");
const hairColorsItem = new UIMenuItem("Couleurs", "Couleurs de votre personnage");
const identityItem = new UIMenuItem("Identité", "Identité de votre personnage");

let angles = [];
for (let i = -180.0; i <= 180.0; i += 15.0) angles.push(i.toFixed(1));
const angleItem = new UIMenuListItem("Angle", "Angle de vision de votre personnage", new ItemsCollection(angles));

const saveItem = new UIMenuItem("Confirmer", "Confirmer votre personnage et commencer votre aventure");
saveItem.BackColor = new Color(0, 150, 0);
saveItem.HighlightedBackColor = new Color(0, 200, 0);

creatorMainMenu.AddItems([genderItem, parentsItem, traitsItem, apparenceItem, hairColorsItem, identityItem, angleItem, saveItem]);

creatorMainMenu.ListChange.on((item, listIndex) => {
    if (item == genderItem) {
        currentGender = listIndex;
        serverEvent("Server.ChangeGender", listIndex);
        refreshMenu();
    } else if (item == angleItem) {
        SetEntityHeading(zFramework.LocalPlayer.pedId, parseFloat(angleItem.SelectedValue));
        ClearPedTasksImmediately(zFramework.LocalPlayer.pedId);
    }
});

on('Client.OnPlayerModelChanged', () => {
    ClearPedTasksImmediately(zFramework.LocalPlayer.pedId);
    refreshMenu();

    creatorHairMenu.Clear();
    fillHairMenu();
    creatorHairMenu.RefreshIndex();

    zFramework.LocalPlayer.applyDefaultOutfit();
});

creatorMainMenu.ItemSelect.on((item, index) => {
    if (item == saveItem) {
        let featureData = [];
        for (let i = 0; i < featureItems.length; i++)
            featureData.push(parseFloat(featureItems[i].SelectedValue));

        let appearanceData = [];
        for (let i = 0; i < appearanceItems.length; i++)
            appearanceData.push({value: ((appearanceItems[i].Index == 0) ? 255 : appearanceItems[i].Index - 1), opacity: appearanceOpacityItems[i].Index * 0.01});
    
        const parentsData = {
            father: Data.fathers[fatherItem.Index],
            mother: Data.mothers[motherItem.Index],
            similarity: similarityItem.Index * 0.01,
            skinSimilarity: skinSimilarityItem.Index * 0.01
        };

        const colorsData = {
            hair: Data.hairList[currentGender][hairItem.Index].ID,
            hairColor: hairColorItem.Index,
            hairHighlight: hairHighlightItem.Index,
            eyeColor: eyeColorItem.Index,
            beardColor: beardColorItem.Index,
            eyebrowColor: eyebrowColorItem.Index,
            blushColor: blushColorItem.Index,
            lipstickColor: lipstickColorItem.Index,
            chestColor: chestHairColorItem.Index
        };

        if (!identityFirstname.RightLabel || identityFirstname.RightLabel == "???" && !identityLastname.RightLabel || identityLastname.RightLabel == "???" || !identityBirthplace.RightLabel || identityBirthplace.RightLabel == "???"
        || identityFirstname.RightLabel.length < 3 || identityFirstname.RightLabel.length > 50 && identityLastname.RightLabel.length < 3 || identityLastname.RightLabel.length > 50)
            return zFramework.Functions.Notify("~r~Vous n'avez pas rempli les champs d'identité.");

        const identityData = {
            firstname: identityFirstname.RightLabel,
            lastname: identityLastname.RightLabel,
            birthplace: identityBirthplace.RightLabel,
            birthday: `${identityBirthday.SelectedValue} ${identityBirthmonth.SelectedValue} ${identityBirthyear.SelectedValue}`,
            sex: currentGender == 0 ? "Homme" : "Femme"
        }

        serverEvent("Server.SaveCharacter", [identityData, {features: featureData, appearance: appearanceData, parents: parentsData, colors: colorsData}]);

        creatorMainMenu.Close();
        DeleteCamera();
        
        zFramework.LocalPlayer.freeze = false;
        zFramework.LocalPlayer.invincible = false;
        zFramework.LocalPlayer.blockInput = false;
        zFramework.LocalPlayer.onReady();
    }
});

// CREATOR PARENTS
let similarities = [];
for (let i = 0; i <= 100; i++) similarities.push(i + "%");

const creatorParentsMenu = new Menu("Parents", parentsItem.Description, new Point(50, 50));

const fatherItem = new UIMenuListItem("Père", "Père de votre personnage", new ItemsCollection(Data.fatherNames));
const motherItem = new UIMenuListItem("Mère", "Mère de votre personnage", new ItemsCollection(Data.motherNames));
const similarityItem = new UIMenuListItem("Ressemblance", "Similarité avec les parents\n(bas = féminin, haut = masculin)", new ItemsCollection(similarities));
const skinSimilarityItem = new UIMenuListItem("Couleur de peau", "Similarité avec la couleur des parents\n(bas = mère, haut = père)", new ItemsCollection(similarities));
const parentsRandomize = new UIMenuItem("Randomiser", "~b~Randomiser les parents");
const parentsReset = new UIMenuItem("Réinitialiser", "~r~Réinitialiser les parents");

creatorParentsMenu.AddItems([fatherItem, motherItem, similarityItem, skinSimilarityItem, parentsRandomize, parentsReset]);
creatorMainMenu.AddSubMenu(creatorParentsMenu, parentsItem);

creatorParentsMenu.ItemSelect.on((item, index) => {
    if (item == parentsRandomize) {
        fatherItem.Index = RandomInt(0, Data.fathers.length - 1);
        motherItem.Index = RandomInt(0, Data.mothers.length - 1);
        similarityItem.Index = RandomInt(0, 100);
        skinSimilarityItem.Index = RandomInt(0, 100);
        updateParents();
    } else if (item == parentsReset) {
        resetParentsMenu();
    }
});

creatorParentsMenu.ListChange.on((item, listIndex) => {
    updateParents();
});

// CREATOR FEATURES
let featureItems = [];
let features = [];
for (let i = -1.0; i <= 1.01; i += 0.01) features.push(i.toFixed(2));

const creatorFeaturesMenu = new Menu("Traits", traitsItem.Description, new Point(50, 50));

for (let i = 0; i < Data.featureNames.length; i++) {
    const tempFeatureItem = new UIMenuListItem(Data.featureNames[i], "", new ItemsCollection(features));
    tempFeatureItem.Index = 100;
    featureItems.push(tempFeatureItem);
    creatorFeaturesMenu.AddItem(tempFeatureItem);
}

const featuresRandomize = new UIMenuItem("Randomiser", "~b~Randomiser les traits");
const featuresReset = new UIMenuItem("Réinitialiser", "~r~Réinitialiser les traits");

creatorFeaturesMenu.AddItems([featuresRandomize, featuresReset]);
creatorMainMenu.AddSubMenu(creatorFeaturesMenu, traitsItem);

creatorFeaturesMenu.ItemSelect.on((item, index) => {
    if (item == featuresRandomize) {
        for (let i = 0; i < Data.featureNames.length; i++) {
            featureItems[i].Index = RandomInt(0, 200);
            updateFaceFeature(i);
        }
    } else if (item == featuresReset) {
        resetFeaturesMenu();
    }
});

creatorFeaturesMenu.ListChange.on((item, listIndex) => {
    console.log(featureItems.indexOf(item));
    updateFaceFeature(featureItems.indexOf(item));
});

// CREATOR APPEARANCE
let appearanceItems = [];
let appearanceOpacityItems = [];
let opacities = [];
for (let i = 0; i <= 100; i++) opacities.push(i + "%");

const creatorAppearanceMenu = new Menu("Apparence", apparenceItem.Description, new Point(50, 50));
const hairItem = new UIMenuListItem("Cheveux", "Cheveux de votre personnage", new ItemsCollection(Data.hairList[currentGender].map(h => h.Name)));

creatorAppearanceMenu.AddItem(hairItem);

for (let i = 0; i < Data.appearanceNames.length; i++) {
    let items = [];
    for (let j = 0, max = GetPedHeadOverlayNum(i); j <= max; j++) items.push((Data.appearanceItemNames[i][j] === undefined) ? j.toString() : Data.appearanceItemNames[i][j]);
    
    const tempAppearanceItem = new UIMenuListItem(Data.appearanceNames[i], "", new ItemsCollection(items));
    appearanceItems.push(tempAppearanceItem);
    creatorAppearanceMenu.AddItem(tempAppearanceItem);
    
    const tempAppearanceOpacityItem = new UIMenuListItem(Data.appearanceNames[i] + " Opacité", "", new ItemsCollection(opacities));
    tempAppearanceOpacityItem.Index = 100;
    appearanceOpacityItems.push(tempAppearanceOpacityItem);
    creatorAppearanceMenu.AddItem(tempAppearanceOpacityItem);
}

const appearanceRandomize = new UIMenuItem("Randomiser", "~b~Randomiser l'apparence");
const appearanceReset = new UIMenuItem("Réinitialiser", "~r~Réinitialiser l'apparence");

creatorAppearanceMenu.AddItems([appearanceRandomize, appearanceReset]);
creatorMainMenu.AddSubMenu(creatorAppearanceMenu, apparenceItem);

creatorAppearanceMenu.ItemSelect.on((item, index) => {
    if (item == appearanceRandomize) {
        hairItem.Index = RandomInt(0, Data.hairList[currentGender].length - 1);
        SetPedComponentVariation(zFramework.LocalPlayer.pedId, 2, Data.hairList[currentGender][hairItem.Index].ID, 0, 2);
        for (let i = 0; i < Data.appearanceNames.length; i++) {
            appearanceItems[i].Index = RandomInt(0, GetPedHeadOverlayNum(i) - 1);
            appearanceOpacityItems[i].Index = RandomInt(0, 100);
            updateAppearance(i);
        }
    } else if (item == appearanceReset) {
        resetAppearanceMenu();
    }
});

creatorAppearanceMenu.ListChange.on((item, listIndex) => {
    if (item == hairItem) {
        const hairStyle = Data.hairList[currentGender][listIndex];
        SetPedComponentVariation(zFramework.LocalPlayer.pedId, 2, hairStyle.ID, 0, 2);
    } else {
        const currentSelection = creatorAppearanceMenu.CurrentSelection - 1;
        let idx = (currentSelection % 2 == 0) ? (currentSelection / 2) : Math.floor(currentSelection / 2);
        updateAppearance(idx);
    }
});

// CREATOR HAIR & COLORS
let hairColorItem;
let hairHighlightItem;
let eyebrowColorItem;
let beardColorItem;
let eyeColorItem;
let blushColorItem;
let lipstickColorItem;
let chestHairColorItem;
let hairRandomize;
let hairReset;

function fillHairMenu() {
    hairColorItem = new UIMenuListItem("Couleur de cheveux", "Couleur de cheveux de votre personnage", new ItemsCollection(hairColors));
    hairHighlightItem = new UIMenuListItem("Couleur des reflets de cheveux", "Couleur des reflets de votre personnage", new ItemsCollection(hairColors));
    eyebrowColorItem = new UIMenuListItem("Couleur des sourcils", "Couleur des sourcils de votre personnage", new ItemsCollection(hairColors));
    beardColorItem = new UIMenuListItem("Couleur de barbe", "Couleur de barbe de votre personnage", new ItemsCollection(hairColors));
    eyeColorItem = new UIMenuListItem("Couleur des yeux", "Couleur des yeux de votre personnage", new ItemsCollection(Data.eyeColors));
    blushColorItem = new UIMenuListItem("Couleur des rougeurs des joues", "Couleur des rougeurs de votre personnage", new ItemsCollection(blushColors));
    lipstickColorItem = new UIMenuListItem("Couleur des lèvres", "Couleur des lèvres de votre personnage", new ItemsCollection(lipstickColors));
    chestHairColorItem = new UIMenuListItem("Couleur des poils de torse", "Couleur des poils de torse de votre personnage", new ItemsCollection(hairColors));
    hairRandomize = new UIMenuItem("Randomiser", "~b~Randomiser les couleurs");
    hairReset = new UIMenuItem("Réinitialiser", "~r~Réinitialiser les couleurs");
    
    creatorHairMenu.AddItems([hairColorItem, hairHighlightItem, eyebrowColorItem, beardColorItem, eyeColorItem, blushColorItem, lipstickColorItem, chestHairColorItem, hairRandomize, hairReset]);
}

const creatorHairMenu = new Menu("Couleurs", hairColorsItem.Description, new Point(50, 50));

fillHairMenu();
creatorMainMenu.AddSubMenu(creatorHairMenu, hairColorsItem);

creatorHairMenu.ItemSelect.on((item, index) => {
    if (item == hairRandomize) {
        hairColorItem.Index = RandomInt(0, Data.maxHairColor);
        hairHighlightItem.Index = RandomInt(0, Data.maxHairColor);
        eyebrowColorItem.Index = RandomInt(0, Data.maxHairColor);
        beardColorItem.Index = RandomInt(0, Data.maxHairColor);
        eyeColorItem.Index = RandomInt(0, Data.maxEyeColor);
        blushColorItem.Index = RandomInt(0, Data.maxBlushColor);
        lipstickColorItem.Index = RandomInt(0, Data.maxLipstickColor);
        chestHairColorItem.Index = RandomInt(0, Data.maxHairColor);
        updateHairAndColors();
    } else if (item == hairReset) {
        resetHairAndColorsMenu();
    }
});

creatorHairMenu.ListChange.on((item, listIndex) => {
    //console.log(hairColorItem.Index);
    switch (creatorHairMenu.CurrentSelection) {
        case 0: // hair color
        case 1: // hair highlight color
            SetPedHairColor(zFramework.LocalPlayer.pedId, hairColorItem.Index, hairHighlightItem.Index);
        break;

        case 2: // eyebrow color
            SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 2, 1, listIndex, 0);
        break;

        case 3: // facial hair color
            SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 1, 1, listIndex, 0);
        break;

        case 4: // eye color
            SetPedEyeColor(zFramework.LocalPlayer.pedId, listIndex);
        break;

        case 5: // blush color
            SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 5, 2, listIndex, 0);
        break;

        case 6: // lipstick color
            SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 8, 2, listIndex, 0);
        break;

        case 7: // chest hair color
            SetPedHeadOverlayColor(zFramework.LocalPlayer.pedId, 10, 1, listIndex, 0);
        break;
    }
});

// CREATOR IDENTITY
let Days = [];
let Years = [];
for (let i = 1; i <= 31; i++) Days.push(i);
for (let i = 1950; i <= 2003; i++) Years.push(i);

const creatorIdentityMenu = new Menu("Identité", identityItem.Description, new Point(50, 50));

const identityFirstname = new UIMenuItem("Prénom", "", "???"); //ask
const identityLastname = new UIMenuItem("Nom", "", "???"); //ask
const identityBirthplace = new UIMenuItem("Lieu de naissance", "", "???"); //ask
const identityBirthday = new UIMenuListItem("Jour de naissance", "", new ItemsCollection(Days));
const identityBirthmonth = new UIMenuListItem("Mois de naisassnce", "", new ItemsCollection(["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"]));
const identityBirthyear = new UIMenuListItem("Année de naissance", "", new ItemsCollection(Years));

creatorIdentityMenu.AddItems([identityFirstname, identityLastname, identityBirthplace, identityBirthday, identityBirthmonth, identityBirthyear]);
creatorMainMenu.AddSubMenu(creatorIdentityMenu, identityItem);

creatorIdentityMenu.ItemSelect.on(async(item, index) => {
    switch(index) {
        case 0:
        case 1:
        case 2:
            item.SetRightLabel(Capitalize(await zFramework.Functions.KeyboardInput(item.Text)));
    }
});

let creatorCamera = null;
function CreateCamera() {
    if (creatorCamera) return;

    if (!creatorCamera) creatorCamera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);

    SetCamActive(creatorCamera, true);
    RenderScriptCams(true, true, 500, true, true);

	SetCamRot(creatorCamera, 0.0, 0.0, 270.0, true);
	
    SetEntityHeading(zFramework.LocalPlayer.pedId, 90.0);
    
    {
        const zoomOffset = 0.6;
        const camOffset = 0.65;
        const coords = zFramework.LocalPlayer.getLocation();

        const angle = angleItem.SelectedValue  * Math.PI / 180.0;
        const theta = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        const pos = {
            x: coords.x + (zoomOffset * theta.x),
            y: coords.y + (zoomOffset * theta.y)
        };

        let angleToLook = angleItem.SelectedValue - 140.0;
        if (angleToLook > 360)
            angleToLook -= 360;
        else if (angleToLook < 0)
		    angleToLook += 360;

        angleToLook = angleToLook * Math.PI / 180.0;
        const thetaToLook = {
            x: Math.cos(angleToLook),
            y: Math.sin(angleToLook)
        };

        const posToLook = {
            x: coords.x + (zoomOffset * thetaToLook.x),
            y: coords.y + (zoomOffset * thetaToLook.y)
        };

        SetCamCoord(creatorCamera, pos.x, pos.y, coords.z + camOffset);
        PointCamAtCoord(creatorCamera, posToLook.x, posToLook.y, coords.z + camOffset);
    }
}

function DeleteCamera() {
    if (!creatorCamera) return;

    SetCamActive(creatorCamera, false);
    RenderScriptCams(false, true, 500, true, true);
    creatorCamera = null;
}

function refreshMenu() {
    resetParentsMenu(true);
    resetFeaturesMenu(true);
    resetAppearanceMenu(true);

    if (currentGender == 0) {
        SetPedComponentVariation(zFramework.LocalPlayer.pedId, 4, 21, 0, 2);
        SetPedComponentVariation(zFramework.LocalPlayer.pedId, 6, 34, 0, 2);
    } else {
        SetPedComponentVariation(zFramework.LocalPlayer.pedId, 4, 10, 0, 2);
        SetPedComponentVariation(zFramework.LocalPlayer.pedId, 6, 35, 0, 2);
    }
}

on('Client.OpenCharacterCreator', async () => {
    if (!creatorMainMenu.Visible) {
        creatorMainMenu.Open();
        refreshMenu();

        zFramework.LocalPlayer.invincible = true;
        zFramework.LocalPlayer.blockInput = true;

        await Delay(1000);

        CreateCamera();
        
        ClearPedTasksImmediately(zFramework.LocalPlayer.pedId);
        zFramework.LocalPlayer.freeze = true;
    }
});