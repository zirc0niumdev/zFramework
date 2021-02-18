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
        this._inventory      = data.playerInventory;
        this._identity       = data.playerIdentity;
        this._skin           = data.playerSkin;
        this._licenseId      = data.licenseId;
        this._discordId      = data.discordId;
        this._dead           = data.dead;
        this._firstSpawn     = data.firstSpawn;
        this._initialized    = false;

        ExecuteCommand(`add_principal identifier.${this._licenseId} group.${this._group}`);

        this.clientEvent('Client.CreatePlayer', data);
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
    * @param {object} data
    */
    set inventory(data) {
        this._inventory = data;

        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    /**
    * @param {boolean} toggle
    */
    set initialized(toggle) {
        this._initialized = toggle;
        
        this.clientEvent('Client.UpdateVar', "initialized", this._initialized);
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

    get firstSpawn() {
        return this._firstSpawn;
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

    get initialized() {
        return this._initialized;
    }

    // Functions
    clientEvent = (eventName, ...args) => {
        if (!this._serverId || this._serverId <= 0) return;
        
        emitNet(eventName, this._serverId, ...args);
    }

    addItem = (name, qty = 1) => {
        if (typeof(qty) !== "number") qty = parseInt(qty);

        if (!zFramework.Items.IsValid(name)) return this.notify("~r~Cet item n'est pas valide, contactez un admin.");
        if (!this.canCarryItem(name, qty)) return this.notify("~r~Vous ne pouvez pas porter plus sur vous.");

        const item = zFramework.Items.GetItem(name);
        const hasItem = zFramework.Inventory.HasItem(this._inventory, item.name, item.type);

        // stack management
        if (hasItem) {
            const itemIndex = zFramework.Inventory.FindItem(this._inventory, item.name, item.type);
            this._inventory[item.type][itemIndex].qty += qty;
        } else this._inventory[item.type].push({ name, qty });

        // weight management
        this._inventory.weight += item.weight * qty;
        
        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    canCarryItem = (name, qty) => {
        const item = zFramework.Items.GetItem(name);
        if (this._inventory.weight + item.weight * qty > zFramework.Inventory.PlayerWeight) return false;

        return true;
    }

    deleteItem = (name, qty = 1) => {
        if (typeof(qty) !== "number") qty = parseInt(qty);

        if (!zFramework.Items.IsValid(name)) return this.notify("~r~Cet item n'est pas valide, contactez un admin.");

        const item = zFramework.Items.GetItem(name);
        const hasItem = zFramework.Inventory.HasItem(this._inventory, item.name, item.type);
        const itemIndex = zFramework.Inventory.FindItem(this._inventory, item.name, item.type);
        if (!hasItem) return;

        // stack management
        this._inventory[item.type][itemIndex].qty -= qty;
        if (this._inventory[item.type][itemIndex].qty <= 0) this._inventory[item.type].splice(itemIndex, 1);

        // weight management
        this._inventory.weight -= item.weight * qty;
        
        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    getIdentifiers = (minimal = false) => zFramework.Functions.GetIdentifiersFromId(this._serverId, minimal);

    getLocation = () => new Vector3(GetEntityCoords(this._pedId)[0].toFixed(2), GetEntityCoords(this._pedId)[1].toFixed(2), GetEntityCoords(this._pedId)[2].toFixed(2));

    setLocation = (location) => SetEntityCoords(this._pedId, location.x, location.y, location.z);

    canSave = () => this._initialized;

    kick = (reason = "Aucune raison spécifiée") => DropPlayer(this._serverId, reason);

    ban = (time, reason) => ExecuteCommand(`bana ${this._serverId} ${time} ${reason}`);

    notify = (text) => this.clientEvent("Client.Notify", text);
    
    savePlayer = async () => {
        if (!this.canSave()) return;

        let playerData = [this._model, JSON.stringify({x: this.getLocation().x, y: this.getLocation().y, z: this.getLocation().z, heading: parseFloat(GetEntityHeading(this.pedId).toFixed(2))}), this._level, this._rank, this._group, this._dead, this._job["id"], this._jobRank, JSON.stringify(this._inventory), this._licenseId];
        if (this._firstSpawn) {
            playerData.push(this._discordId, GetPlayerEndpoint(this._serverId), JSON.stringify(this._identity), JSON.stringify(this._skin));
            return await zFramework.Database.Query('INSERT INTO players (model, location, level, rank, players.group, dead, job, job_rank, inventory, license, discord, ip, players.identity, skin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', playerData).then(() => {
				console.log(`\x1b[33m[zFramework]\x1b[37m ${this._name} created in the DB.`);
			});
        }
        
        return await zFramework.Database.Query('UPDATE players SET model = ?, location = ?, level = ?, rank = ?, players.group = ?, dead = ?, job = ?, job_rank = ?, inventory = ? WHERE license = ?', playerData).then(() => {
            console.log(`\x1b[33m[zFramework]\x1b[37m Saved ${this._name}!`);
        });
    }
}
