import Vector3 from "../../shared/class/CVector3";

export default class CLocalPlayer {
    constructor(data) {
        data = JSON.parse(data);

        this._id             = PlayerId();
        this._serverId       = data.serverId;
        this._pedId          = PlayerPedId();
        this._uuid           = data.UUID;
        this._name           = data.name;
        this._model          = data.model;
        this._sex            = data.sex;
        this._money          = data.money;
        this._dirtyMoney     = data.dirtyMoney;
        this._bank           = data.bank;
        this._character      = data.character;
        this._needs          = data.needs;
        this._inventory      = data.inventory;
        this._dead           = data.dead;
        this._rank           = data.rank;
        this._group          = data.group;
        this._job            = data.job;
        this._jobRank        = data.jobRank;
        this._invincible     = false;
        this._invisible      = false;
        this._freeze         = false;
        this._blockInput     = false;
        this._ko             = false;
        this._ragdoll        = false;
        this._spectateMode   = false;
        this._cinemaMode     = false;
        this._wounded        = false;
        this._cantRun        = false;
        this._busy           = 0;
        this._afk            = false;
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
    * @param {string} name
    */
    set model(name) {
        this._model = name;
        this._pedId = PlayerPedId();
    }

    /**
    * @param {Number} num
    */
    set sex(num) {
        this._sex = num;
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
    * @param {Object} data
    */
    set character(data) {
        this._character = data;
    }

    /**
    * @param {Object} data
    */
    set needs(data) {
        this._needs = data;

        zFramework.Core.Needs.OnUpdated();
    }

    /**
    * @param {Object} data
    */
    set inventory(data) {
        this._inventory = data;

        zFramework.Core.Inventory.OnUpdated();
    }

    /**
    * @param {boolean} toggle
    */
    set dead(toggle) {
        this._dead = toggle;
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
    * @param {boolean} toggle
    */
    set invincible(toggle) {
        this._invincible = toggle;
        SetPlayerInvincible(this._id, toggle);
        if (this._group > zFramework.Groups.PLAYER) zFramework.Functions.Notify(`Invincibilité ${toggle && "~g~ACTIVE" || "~r~DESACTIVE"}`);
    }

    /**
    * @param {boolean} toggle
    */
    set invisible(toggle) {
        this._invisible = toggle;
        SetEntityVisible(this._pedId, !toggle, false);
        if (this._group > zFramework.Groups.PLAYER) zFramework.Functions.Notify(`Invisibilité ${toggle && "~g~ACTIVE" || "~r~DESACTIVE"}`);
    }

    /**
    * @param {boolean} toggle
    */
    set freeze(toggle) {
        this._freeze = toggle;
        FreezeEntityPosition(this._pedId, toggle);
        if (this._group > zFramework.Groups.PLAYER) zFramework.Functions.Notify(`Freeze ${toggle && "~g~ACTIVE" || "~r~DESACTIVE"}`);
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
    set ragdoll(toggle) {
        this._ragdoll = toggle;
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
    * @param {Boolean} toggle
    */
    set wounded(toggle) {
        this._wounded = toggle;
    }

    /**
    * @param {Boolean} toggle
    */
    set cantRun(toggle) {
        this._cantRun = toggle;
    }

    /**
    * @param {Number} int
    */
    set busy(int) {
        this._busy = int;
    }

    /**
    * @param {Boolean} toggle
    */
    set afk(toggle) {
        this._afk = toggle;
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

    get serverId() {
        return this._serverId;
    }

    get pedId() {
        return this._pedId;
    }

    get UUID() {
        return this._uuid;
    }

    get name() {
        return this._name;
    }

    get model() {
        return this._model;
    }

    get sex() {
        return this._sex;
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

    get character() {
        return this._character;
    }
    
    get needs() {
        return this._needs;
    }
    
    get inventory() {
        return this._inventory;
    }

    get dead() {
        return this._dead;
    }

    get rank() {
        return this._rank;
    }

    get group() {
        return this._group;
    }

    get job() {
        return this._job;
    }
    
    get jobRank() {
        return this._jobRank;
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

    get wounded() {
        return this._wounded;
    }

    get cantRun() {
        return this._cantRun;
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

    get busy() {
        return this._busy;
    }

    get afk() {
        return this._afk;
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
        if (!this._character) zFramework.Core.CharacterCreator.Open();
        else this.loadSkin();

        if (this._dead && !IsEntityDead(this._pedId)) ApplyDamageToPed(this._pedId, 500);
        else SetEntityHealth(this._pedId, this._needs.health);

        this.tick();
        this.thread();
    }

    onReady = () => {
        DoScreenFadeIn(2000);
        PlaySoundFrontend(-1, "CHARACTER_SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", 0);
        zFramework.Functions.Notify("~p~SantosRP~w~\nBienvenue et bon jeu.");
    }

    loadSkin = () => {
        this.onReady();
    }

    setLocation = (location) => {
        SetEntityCoords(this._pedId, location.x, location.y, location.z)
        if (location.heading || location.h) SetEntityHeading(this._pedId, location.heading || location.h);
    };

    getLocation = () => new Vector3(GetEntityCoords(this._pedId)[0].toFixed(2), GetEntityCoords(this._pedId)[1].toFixed(2), GetEntityCoords(this._pedId)[2].toFixed(2));

    getHeading = () => parseFloat(GetEntityHeading(this._pedId).toFixed(2));

    getForwardVector = () => new Vector3(GetEntityForwardVector(this._pedId)[0].toFixed(2), GetEntityForwardVector(this._pedId)[1].toFixed(2), GetEntityForwardVector(this._pedId)[2].toFixed(2));

    getFront = () => this.getLocation().add(this.getForwardVector().multiply(0.5));

    isPed = () => this._sex > 1;

    isInVehicle = () => GetVehiclePedIsIn(this._pedId, false);

    can = () => {
        if (this._busy != 0 || this._dead || this._ko) return false;
        return true;
    }

    tick = () => {
        setTick(() => {
            if (this._ragdoll) {
                SetPedToRagdoll(this._pedId, 1000, 1000, 0, 0, 0, 0);
                ResetPedRagdollTimer(this._pedId);
            }

            if (this._ragdoll && !this._ko && !this._dead && !IsEntityAttached(this._pedId)) {
                zFramework.Functions.TopNotify("Appuyez sur ~INPUT_CONTEXT~ ou ~INPUT_JUMP~ pour ~b~vous relever~w~.");
                if (IsControlJustPressed(1, 51) || IsControlJustPressed(1, 22)) this._ragdoll = false;
            }

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

            SetPlayerHealthRechargeMultiplier(this._id, .0)

            zFramework.Core.Think();
        });
    }

    thread = () => {
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
