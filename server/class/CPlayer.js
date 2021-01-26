import Vector3 from "../../shared/class/CVector3";

export default class CPlayer {
    constructor(data) {
        this._serverId       = data.serverId;
        this._pedId          = data.pedId;
        this._name           = data.playerName;
        this._spawnLocation  = data.spawnLocation;
        this._model          = data.playerModel;
        this._group          = data.playerGroup;
        this._level          = data.playerLevel;
        this._rank           = data.playerRank;
        this._job            = data.playerJob;
        this._jobRank        = data.playerJobRank;
        this._identity       = data.playerIdentity;
        this._skin           = data.playerSkin;
        this._licenseId      = data.licenseId;
        this._discordId      = data.discordId;
        this._dead           = data.dead;
        this._firstSpawn     = data.firstSpawn || false;
        this._initialized    = false;

        ExecuteCommand(`add_principal identifier.${this._licenseId} group.${this._group}`);
        
        this.clientEvent('Client.CreatePlayer', data);

        console.log(`${this._name} spawned!`);
    }

    /**
    * @param {string} name
    */
    set model(name) {
        this._model = name;

        this.clientEvent('Client.UpdateVar', "model", this._model);
    }

    /**
    * @param {Object} data
    */
    set skin(data) {
        this._skin = data;

        this.clientEvent('Client.UpdateSkin', this._skin);
        this.clientEvent('Client.UpdateVar', "skin", this._skin);
    }

    /**
    * @param {Object} data
    */
    set identity(data) {
        this._identity = data;

        this.clientEvent('Client.UpdateVar', "identity", this._identity);
    }

    /**
    * @param {boolean} toggle
    */
    set dead(toggle) {
        this._dead = toggle;

        this.clientEvent('Client.UpdateVar', "dead", this._isDead);
    }

    /**
    * @param {number} amount
    */
    set level(amount) {
        this._level = amount;

        this.clientEvent('Client.UpdateVar', "level", this._level);
    }

    /**
    * @param {number} type
    */
    set rank(type) {
        this._rank = type;

        this.clientEvent('Client.UpdateVar', "rank", this._rank);
    }

    /**
    * @param {number} type
    */
    set group(type) {
        ExecuteCommand(`remove_principal identifier.${this._licenseId} group.${this._group}`);
        this._group = type;
        ExecuteCommand(`add_principal identifier.${this._licenseId} group.${this._group}`);

        this.clientEvent('Client.UpdateVar', "group", this._group);
    }

    /**
    * @param {number} id
    */
    set job(id) {
        const job = zFramework.Jobs.GetJobFromId(id);
        
        this._job = job;

        this.clientEvent('Client.UpdateVar', "job", this._job);
    }

    /**
    * @param {number} id
    */
    set jobRank(id) {
        this._jobRank = id;

        this.clientEvent('Client.UpdateVar', "jobrank", this._jobRank);
    }

    /**
    * @param {boolean} toggle
    */
    set initialized(toggle) {
        this._initialized = toggle;
    }

    //Getters
    get serverId() {
        return this._serverId;
    }
    
    get name() {
        return this._name;
    }

    get pedId() {
        return this._pedId;
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

    get licenseId() {
        return this._licenseId;
    }

    get discordId() {
        return this._discordId;
    }

    get dead() {
        return this._dead;
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

    get job() {
        return this._job;
    }
    
    get jobRank() {
        return this._jobRank;
    }

    get initialized() {
        return this._initialized;
    }

    // Functions
    clientEvent = (eventName, ...args) => {
        if (!this._serverId || this._serverId <= 0) return;
        
        emitNet(eventName, this._serverId, ...args);
    }

    getLocation = () => new Vector3(GetEntityCoords(this._pedId)[0].toFixed(2), GetEntityCoords(this._pedId)[1].toFixed(2), GetEntityCoords(this._pedId)[2].toFixed(2));

    setLocation = (location) => SetEntityCoords(this._pedId, location.x, location.y, location.z);

    canSave = () => this._initialized;

    kick = (reason) => DropPlayer(this._serverId, reason || null);

    //ban = (args...) => ...

    notify = (text) => this.clientEvent("Client.Notify", text || "~r~empty notification - error code:first param was empty.");
    
    savePlayer = async () => {
        if (!this.canSave()) return;

        let playerData = [this._model, JSON.stringify({x: this.getLocation().x, y: this.getLocation().y, z: this.getLocation().z, heading: parseFloat(GetEntityHeading(this.pedId).toFixed(2))}), this._level, this._rank, this._group, this._dead, Object.keys(this._job)[0], this._jobRank, this._licenseId];
        if (this._firstSpawn) {
            playerData.push(this._discordId, GetPlayerEndpoint(this._serverId), JSON.stringify(this._identity), JSON.stringify(this._skin));
            return await zFramework.DB.Query('INSERT INTO players (model, location, level, rank, players.group, dead, job, job_rank, license, discord, ip, players.identity, skin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', playerData).then(() => {
				console.log(`\x1b[33m[zFramework]\x1b[37m ${this._name} created in the DB.`);
			});
        }

        return await zFramework.DB.Query('UPDATE players SET model = ?, location = ?, level = ?, rank = ?, players.group = ?, dead = ? WHERE license = ?', playerData).then(() => {
            console.log(`\x1b[33m[zFramework]\x1b[37m Saved ${this._name}!`);
        });
    }
}
