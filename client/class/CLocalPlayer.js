import Vector3 from "../../shared/class/CVector3";

export default class CLocalPlayer {
    constructor(data) {
        this._id             = PlayerId();
        this._serverId       = data.serverId;
        this._pedId          = PlayerPedId();
        this._money          = data.playerMoney;
        this._dirtyMoney     = data.playerDirtyMoney;
        this._bank           = data.playerBank;
        this._spawnLocation  = data.spawnLocation;
        this._model          = data.playerModel;
        this._group          = data.playerGroup;
        this._level          = data.playerLevel;
        this._rank           = data.playerRank;
        this._job            = data.playerJob;
        this._jobRank        = data.playerJobRank;
        this._inventory      = data.playerInventory;
        this._needs          = data.playerNeeds;
        this._identity       = data.playerIdentity;
        this._skin           = data.playerSkin;
        this._dead           = data.dead;
        this._uuid           = data.playerUUID;
        this._invincible     = false;
        this._invisible      = false;
        this._freeze         = false;
        this._blockInput     = false;
        this._ko             = false;
        this._spectateMode   = false;
        this._cinemaMode     = false;
        this._initialized    = false;

        this.onSpawned();
    }
    
    // Setters
    /**
    * @param {number} id
    */
    set pedId(id) {
        this._pedId = id;
    }

    /**
    * @param {Number} amount
    */
    set money(amount) {
        this._money = amount;
        zFramework.Core.Inventory.OnUpdated();
    }

    /**
    * @param {Number} amount
    */
    set dirtyMoney(amount) {
        this._dirtyMoney = amount;
        zFramework.Core.Inventory.OnUpdated();
    }

    /**
    * @param {Number} amount
    */
    set bank(amount) {
        this._bank = amount;
        zFramework.Core.Bank.SetSolde();
    }

    /**
    * @param {string} name
    */
    set model(name) {
        this._model = name;
        this._pedId = PlayerPedId();
    }

    /**
    * @param {Object} data
    */
    set skin(data) {
        this._skin = data;
    }

    /**
    * @param {Object} data
    */
    set identity(data) {
        this._identity = data;
    }

    /**
    * @param {boolean} toggle
    */
    set dead(toggle) {
        this._dead = toggle;
    }

    /**
    * @param {number} amount
    */
    set level(amount) {
        this._level = amount;
    }

    /**
    * @param {number} type
    */
    set rank(type) {
        this._rank = type;
    }

    /**
    * @param {number} type
    */
    set group(type) {
        this._group = type;
    }

    /**
    * @param {boolean} toggle
    */
    set invincible(toggle) {
        this._invincible = toggle;
        SetEntityInvincible(this._pedId, toggle);
    }

    /**
    * @param {boolean} toggle
    */
    set invisible(toggle) {
        this._invisible = toggle;
        SetEntityVisible(this._pedId, toggle, false);
    }

    /**
    * @param {boolean} toggle
    */
    set freeze(toggle) {
        this._freeze = toggle;
        FreezeEntityPosition(this._pedId, toggle);
    }

    /**
    * @param {boolean} toggle
    */
    set blockInput(toggle) {
        this._blockInput = toggle;
        const blockInputTick = setTick(() => {
            if (this._blockInput) {
                DisableControlAction(2, 30, true);
                DisableControlAction(2, 31, true);
                DisableControlAction(2, 32, true);
                DisableControlAction(2, 33, true);
                DisableControlAction(2, 34, true);
                DisableControlAction(2, 35, true);
                DisableControlAction(2, 36, true);
                DisableControlAction(2, 37, true);
                DisableControlAction(2, 44, true);
                DisableControlAction(0, 25, true);
                DisableControlAction(0, 24, true);
                DisableControlAction(0, 140, true);
            } else clearTick(blockInputTick);
        });
    }

    /**
    * @param {Boolean} toggle
    */
    set ko(toggle) {
        this._ko = toggle;
    }

    /**
    * @param {Boolean} toggle
    */
    set spectateMode(toggle) {
        this._spectateMode = toggle;
    }

    /**
    * @param {Boolean} toggle
    */
    set cinemaMode(toggle) {
        this._cinemaMode = toggle;
    }

    /**
    * @param {Object} job
    */
    set job(job) {
        this._job = job;
    }

    /**
    * @param {number} id
    */
    set jobRank(id) {
        this._jobRank = id;
    }

    /**
    * @param {Object} data
    */
    set inventory(data) {
        this._inventory = data;

        zFramework.Core.Inventory.OnUpdated();
    }

    /**
    * @param {Object} data
    */
    set needs(data) {
        this._needs = data;

        zFramework.Core.Needs.OnUpdated();
    }

    /**
    * @param {boolean} toggle
    */
    set initialized(toggle) {
        this._initialized = toggle;

        if (this._initialized) this.onInitialized();
    }

    //Getters
    get playerId() {
        return this._id;
    }

    get pedId() {
        return this._pedId;
    }

    get serverId() {
        return this._serverId;
    }

    get UUID() {
        return this._uuid;
    }

    get money() {
        return this._money;
    }

    get dirtyMoney() {
        return this._dirtyMoney;
    }

    get bank() {
        return this._bank;
    }

    get spawnLocation() {
        return this._spawnLocation;
    }

    get model() {
        return this._model;
    }

    get skin() {
        return this._skin;
    }

    get identity() {
        return this._identity;
    }

    get dead() {
        return this._dead;
    }

    get ko() {
        return this._ko;
    }

    get spectateMode() {
        return this._spectateMode;
    }

    get cinemaMode() {
        return this._cinemaMode;
    }

    get level() {
        return this._level;
    }

    get rank() {
        return this._rank;
    }

    get group() {
        return this._group;
    }

    get invincible() {
        return this._invincible;
    }

    get invisible() {
        return this._invisible;
    }

    get freeze() {
        return this._freeze;
    }

    get blockInput() {
        return this._blockInput;
    }

    get job() {
        return this._job;
    }
    
    get jobRank() {
        return this._jobRank;
    }
    
    get inventory() {
        return this._inventory;
    }
    
    get needs() {
        return this._needs;
    }

    get initialized() {
        return this._initialized;
    }

    //Functions
    onSpawned = async () => {
        await zFramework.Functions.SetModel(this._model);

        for (let i = 1; i <= 15; i++) EnableDispatchService(i, false);
        DisablePlayerVehicleRewards(this._pedId);
        N_0x170f541e1cadd1de(false); // Related to displaying cash on the HUD
        NetworkSetFriendlyFireOption(true); 
        SetPoliceIgnorePlayer(this._pedId, true);
        SetMaxWantedLevel(0);
        SetCreateRandomCops(false);
        SetCreateRandomCopsOnScenarios(false);
        SetCreateRandomCopsNotOnScenarios(false);
    
        zFramework.Modules.Initialize();
        zFramework.Core.Initialize();
        
        serverEvent("Server.onPlayerSpawned");
    }

    onInitialized = async () => {
        this.applyDefaultOutfit();

        if (!this._identity && !this._skin) emit('Client.OpenCharacterCreator');
        else {
            this.loadSkin();
            /// Load Clothes (PUT ON READY IN LOAD CLOTHES!!!)
        }

        DoScreenFadeIn(2000);

        this.tick();
        this.utils();
    }

    onReady = () => {
        PlaySoundFrontend(-1, "CHARACTER_SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", 0);
        zFramework.Functions.Notify("~p~SantosRP~w~\nBienvenue et bon jeu.");
    }

    isInVehicle = () => GetVehiclePedIsIn(this._pedId, false);

    applyDefaultOutfit = () => {
        SetPedDefaultComponentVariation(this._pedId);
        SetPedComponentVariation(this._pedId, 3, 15, 0, 2);
        SetPedComponentVariation(this._pedId, 8, 15, 0, 2);
        SetPedComponentVariation(this._pedId, 11, 15, 0, 2);

        if (this._model == "mp_m_freemode_01") {
            SetPedComponentVariation(this._pedId, 4, 21, 0, 2);
            SetPedComponentVariation(this._pedId, 6, 34, 0, 2);
        } else if (this._model == "mp_f_freemode_01") {
            SetPedComponentVariation(this._pedId, 4, 10, 0, 2);
            SetPedComponentVariation(this._pedId, 6, 35, 0, 2);
        }
    }

    loadSkin = () => {
        // Features
        for (const feature in this._skin.features) SetPedFaceFeature(this._pedId, parseInt(feature), parseFloat(this._skin.features[feature]));

        // Appearance
        for (const [index, overlay] of Object.entries(this._skin.appearance)) SetPedHeadOverlay(this._pedId, index, overlay.value, overlay.opacity);

        // Parents
        SetPedHeadBlendData(
          this._pedId,
          parseInt(this._skin.parents.mother),
          parseInt(this._skin.parents.father),
          0,
          parseInt(this._skin.parents.mother),
          parseInt(this._skin.parents.father),
          0,
          parseFloat(this._skin.parents.similarity),
          parseFloat(this._skin.parents.skinSimilarity),
          0.0,
          false
        );

        // Colors
        SetPedComponentVariation(this._pedId, 2, this._skin.colors.hair, 0, 2);
        SetPedHairColor(this._pedId, parseInt(this._skin.colors.hairColor), parseInt(this._skin.colors.hairHighlight));
        SetPedEyeColor(this._pedId, parseInt(this._skin.colors.eyeColor));
        SetPedHeadOverlayColor(this._pedId, 1, 1, parseInt(this._skin.colors.beardColor), 0);
        SetPedHeadOverlayColor(this._pedId, 2, 1, parseInt(this._skin.colors.eyebrowColor), 0);
        SetPedHeadOverlayColor(this._pedId, 5, 2, parseInt(this._skin.colors.blushColor), 0);
        SetPedHeadOverlayColor(this._pedId, 8, 2, parseInt(this._skin.colors.lipstickColor), 0);
        SetPedHeadOverlayColor(this._pedId, 10, 1, parseInt(this._skin.colors.chestColor), 0);

        this.onReady();
    }

    getLocation = () => new Vector3(GetEntityCoords(this._pedId)[0].toFixed(2), GetEntityCoords(this._pedId)[1].toFixed(2), GetEntityCoords(this._pedId)[2].toFixed(2));

    getForwardVector = () => new Vector3(GetEntityForwardVector(this._pedId)[0].toFixed(2), GetEntityForwardVector(this._pedId)[1].toFixed(2), GetEntityForwardVector(this._pedId)[2].toFixed(2));

    getFront = () => this.getLocation().add(this.getForwardVector().multiply(0.5));

    can = () => {
        if (this._dead || this._ko) return false;

        return true;
    }

    tick = () => {
        setTick(() => {
            const enteringVeh = GetVehiclePedIsTryingToEnter(this._pedId);
            if (enteringVeh && DoesEntityExist(enteringVeh)) {
                const modelEntering = GetEntityModel(enteringVeh);
                if (!IsEntityAMissionEntity(enteringVeh) && !GetVehicleDoorsLockedForPlayer(enteringVeh, this._Id) &&
                (IsThisModelACar(modelEntering) || IsThisModelABike(modelEntering) || IsThisModelAHeli(modelEntering) || IsThisModelAPlane(modelEntering)) && !IsThisModelABicycle(modelEntering)) {
                    const pedInSeatCount = GetPedInVehicleSeat(enteringVeh, -1);
                    if (pedInSeatCount && !IsPedAPlayer(pedInSeatCount)) ClearPedTasks(this._pedId);
                    else if (pedInSeatCount == 0) SetVehicleDoorsLockedForPlayer(enteringVeh, this._Id, true);
                }
            }
    
            SetSomeVehicleDensityMultiplierThisFrame(0.7);
            SetScenarioPedDensityMultiplierThisFrame(0.7, 0.7);
            SetPedDensityMultiplierThisFrame(0.7);
            SetVehicleDensityMultiplierThisFrame(0.7);
            SetParkedVehicleDensityMultiplierThisFrame(0.7);
            
            RemoveAllPickupsOfType(14);

            DisableControlAction(2, 47, true);

            zFramework.Core.Think();
        });
    }

    utils = () => {
        const SCENARIO_TYPES = ["WORLD_VEHICLE_MILITARY_PLANES_SMALL", "WORLD_VEHICLE_MILITARY_PLANES_BIG"];
	    const SCENARIO_GROUPS = [2017590552, 2141866469, 1409640232, "ng_planes"];
	    const SUPPRESSED_MODELS = ["BLIMP", "SHAMAL", "LUXOR", "LUXOR2", "JET", "LAZER", "TITAN", "BARRACKS", "BARRACKS2", "CRUSADER", "RHINO", "AIRTUG", "RIPLEY", "MIXER", "FIRETRUK", "duster", "frogger", "maverick", "buzzard", "buzzard2", "polmav", "tanker", "tanker2"];

        setInterval(() => {
            for (const sctyp of SCENARIO_TYPES) SetScenarioTypeEnabled(sctyp, false);
                
            for (const scgrp of SCENARIO_GROUPS) SetScenarioGroupEnabled(scgrp, false);

            for (const model of SUPPRESSED_MODELS) SetVehicleModelIsSuppressed(GetHashKey(model), true);
        }, 10000);
    }
}
