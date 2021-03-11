export default class CMarker {
    constructor(data) {
        this._type = data.type; // https://docs.fivem.net/docs/game-references/markers/
        this._coords = data.coords;
        this._scale = data.scale;
        this._color = data.color;
        this._bobUpAndDown = data.bobUpAndDown;
        this._faceCamera = data.faceCamera;
        this._rotate = data.rotate;
        this._drawOnEnts = data.drawOnEnts;

        const marker = DrawMarker(this._type, this._coords[0], this._coords[1], this._coords[2], 0, 0, 0, 0, 0, 0, this._scale[0], this._scale[1], this._scale[2], this._color[0], this._color[1], this._color[2], this._color[3], this._bobUpAndDown, this._faceCamera, -1, this._rotate, "", "", this._drawOnEnts);

        this._marker = {
            marker,
            data: {
                type: this._type,
                coords: [this._coords[0], this._coords[1], this._coords[2]],
                direction: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [this._scale[0], this._scale[1], this._scale[2]],
                color: [this._color[0], this._color[1], this._color[2], this._color[3]],
                bobUpAndDown: this._bobUpAndDown,
                faceCamera: this._faceCamera,
                rotate: this._rotate,
                drawOnEnts: this._drawOnEnts
            }
        }

        return this._marker;
    }
}

// // https://docs.fivem.net/docs/game-references/blips/
// export default class CBlip {
//     constructor(vector3Pos, intSprite, intColor, stringText, boolRoad, floatScale, intDisplay, intAlpha) {
//         const blip = AddBlipForCoord(vector3Pos.x, vector3Pos.y, vector3Pos.z);
        
//         SetBlipSprite(blip, intSprite);
//         SetBlipAsShortRange(blip, true);
//         if (intColor) SetBlipColour(blip, intColor);
//         if (floatScale) SetBlipScale(blip, floatScale);
//         if (boolRoad) SetBlipRoute(blip, boolRoad);
//         if (intDisplay) SetBlipDisplay(blip, intDisplay);
//         if (intAlpha) SetBlipAlpha(blip, intAlpha);
//         if (stringText && !intDisplay || intDisplay != 8) {
//             BeginTextCommandSetBlipName("STRING");
//             AddTextComponentString(stringText);
//             EndTextCommandSetBlipName(blip);
//         }

//         return blip;
//     }
// }