// https://docs.fivem.net/docs/game-references/blips/
export default class CBlip {
    constructor(vector3Pos, intSprite, intColor, stringText, boolRoad, floatScale, intDisplay, intAlpha) {
        const blip = AddBlipForCoord(vector3Pos.x, vector3Pos.y, vector3Pos.z);
        
        SetBlipSprite(blip, intSprite);
        SetBlipAsShortRange(blip, true);
        if (intColor) SetBlipColour(blip, intColor);
        if (floatScale) SetBlipScale(blip, floatScale);
        if (boolRoad) SetBlipRoute(blip, boolRoad);
        if (intDisplay) SetBlipDisplay(blip, intDisplay);
        if (intAlpha) SetBlipAlpha(blip, intAlpha);
        if (stringText && !intDisplay || intDisplay != 8) {
            BeginTextCommandSetBlipName("STRING");
            AddTextComponentString(stringText);
            EndTextCommandSetBlipName(blip);
        }

        return blip;
    }
}