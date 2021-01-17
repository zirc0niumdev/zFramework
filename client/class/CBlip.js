export default class CBlip {
    constructor(data) {
        this._coords = data.coords;
        this._scale = data.scale;
        this._color = data.color;
        this._alpha = data.alpha;
        this._shortRange = data.shortRange;
        this._sprite = data.sprite; // https://docs.fivem.net/docs/game-references/blips/

        const blip = AddBlipForCoord(this._coords);
        this._blip = {
            blip,
            data: {
                coords: this._coords,
                scale: this._scale,
                color: this._color,
                alpha: this._alpha,
                shortRange: this._shortRange,
                sprite: this._sprite,
            }
        };

        SetBlipAlpha(blip, this._alpha);
        SetBlipAsShortRange(blip, this._shortRange);
        SetBlipColour(blip, this._color);
        SetBlipScale(blip, this._scale);
        SetBlipSprite(blip, this._sprite);

        return this._blip;
    }
}