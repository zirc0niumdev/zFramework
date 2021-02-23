import Vector3 from "../../shared/class/CVector3";

export default class CPlayer {
    constructor(data) {
        this._serverId       = data.serverId;
        this._pedId          = data.pedId;
        this._name           = data.playerName;
        this._money          = data.playerMoney;
        this._dirtyMoney     = data.playerDirtyMoney;
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
        this._licenseId      = data.licenseId;
        this._discordId      = data.discordId;
        this._dead           = data.dead;
        this._uuid           = data.playerUUID;
        this._firstSpawn     = data.firstSpawn;
        this._initialized    = false;

        ExecuteCommand(`add_principal identifier.${this._licenseId} group.${this._group}`);

        this.clientEvent('Client.CreatePlayer', data);
    }

    /**
    * @param {String} name
    */
    set model(name) {
        this._model = name;

        this.clientEvent('Client.UpdateVar', "model", this._model);
    }

    /**
    * @param {Number} amount
    */
    set money(amount) {
        this._money = amount;

        this.clientEvent('Client.UpdateVar', "money", this._money);
    }

    /**
    * @param {Number} amount
    */
    set dirtyMoney(amount) {
        this._dirtyMoney = amount;

        this.clientEvent('Client.UpdateVar', "dirtyMoney", this._dirtyMoney);
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
    * @param {Boolean} toggle
    */
    set dead(toggle) {
        this._dead = toggle;

        this.clientEvent('Client.UpdateVar', "dead", this._isDead);
    }

    /**
    * @param {Number} amount
    */
    set level(amount) {
        this._level = amount;

        this.clientEvent('Client.UpdateVar', "level", this._level);
    }

    /**
    * @param {Number} type
    */
    set rank(type) {
        this._rank = type;

        this.clientEvent('Client.UpdateVar', "rank", this._rank);
    }

    /**
    * @param {Number} type
    */
    set group(type) {
        ExecuteCommand(`remove_principal identifier.${this._licenseId} group.${this._group}`);
        this._group = type;
        ExecuteCommand(`add_principal identifier.${this._licenseId} group.${this._group}`);

        this.clientEvent('Client.UpdateVar', "group", this._group);
    }

    /**
    * @param {Number} id
    */
    set job(id) {
        const job = zFramework.Jobs.GetJobFromId(id);
        
        this._job = job;

        this.clientEvent('Client.UpdateVar', "job", this._job);
    }

    /**
    * @param {Number} id
    */
    set jobRank(id) {
        this._jobRank = id;

        this.clientEvent('Client.UpdateVar', "jobrank", this._jobRank);
    }

    /**
    * @param {Object} data
    */
    set inventory(data) {
        this._inventory = data;

        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    /**
    * @param {Object} data
    */
    set needs(data) {
        for (const type in data) this._needs[type] = data[type];
        
        this.clientEvent('Client.UpdateVar', "needs", this._needs);
    }

    /**
    * @param {Boolean} toggle
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

    get money() {
        return this._money;
    }

    get dirtyMoney() {
        return this._dirtyMoney;
    }

    get uuid() {
        return this._uuid;
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

    get needs() {
        return this._needs;
    }

    get initialized() {
        return this._initialized;
    }

    // Functions
    clientEvent = (eventName, ...args) => {
        if (!this._serverId || this._serverId <= 0) return;
        
        emitNet(eventName, this._serverId, ...args);
    }

    addHunger = (amount) => this._needs = { hunger: Math.max(0, Math.min(100, this._needs.hunger + amount)) };

    addThirst = (amount) => this._needs = { thirst: Math.max(0, Math.min(100, this._needs.thirst + amount)) };

    addItem = (name, num = 1, data = {}) => {
        if (typeof(num) !== "number") num = Number(num);

        const item = zFramework.Core.Items.Get(name);
        if (!item) return;

        // stack management
        if (!this.inventory.items[name]) this.inventory.items[name] = [];
        for (let i=0; i < num; i++) this.inventory.items[name].push(data);
    
        // weight management
        this._inventory.weight += (item.weight || zFramework.Core.Inventory.DefaultWeight) * num;
            
        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    getItemData = (name, num) => {
        if (typeof(num) !== "number") num = Number(num);

        if (!this.inventory.items[name][num]) return;

        return this.inventory.items[name][num];
    }
    
    updateItem = (name, num, data = {}) => {
        if (typeof(num) !== "number") num = Number(num);

        if (!this.inventory.items[name][num]) return;

        // data management
        this.inventory.items[name][num] = data;
            
        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    changeWeaponSlot = (key, value) => {
        this._inventory[key] = value;

        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    };

    deleteItem = (name, num) => {
        const item = zFramework.Core.Items.Get(name);
        if (!item) return;

        if (!this.inventory.items[name]) return;

        // stack management
        if (typeof(num) === "object") for (const key of num) {
            if (!this.inventory.items[name][key]) return;
            this.inventory.items[name].splice(key, 1);
        } else this.inventory.items[name].splice(0, num);

        if (this.inventory.items[name].length <= 0) delete this.inventory.items[name];

        // weight management
        if (item.weight) this._inventory.weight -= (item.weight || zFramework.Core.Inventory.DefaultWeight) * num;

        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    getIdentifiers = (minimal = false) => zFramework.Functions.GetIdentifiersFromId(this._serverId, minimal);

    setLocation = (location) => SetEntityCoords(this._pedId, location.x, location.y, location.z);

    getLocation = () => new Vector3(GetEntityCoords(this._pedId)[0].toFixed(2), GetEntityCoords(this._pedId)[1].toFixed(2), GetEntityCoords(this._pedId)[2].toFixed(2));

    canSave = () => this._initialized;

    kick = (reason = "Aucune raison spécifiée") => DropPlayer(this._serverId, reason);

    ban = (time, reason) => ExecuteCommand(`bana ${this._serverId} ${time} ${reason}`);

    notify = (text) => this.clientEvent("Client.Notify", text);
    
    savePlayer = async () => {
        if (!this.canSave()) return;

        let playerData = [this._money, this._dirtyMoney, this._model, JSON.stringify({x: this.getLocation().x, y: this.getLocation().y, z: this.getLocation().z, heading: parseFloat(GetEntityHeading(this.pedId).toFixed(2))}), this._level, this._rank, this._group, this._dead, this._job["id"], this._jobRank, JSON.stringify(this._inventory), JSON.stringify(this._needs), this._licenseId];
        if (this._firstSpawn) {
            playerData.push(this._discordId, GetPlayerEndpoint(this._serverId), JSON.stringify(this._identity), JSON.stringify(this._skin, this._uuid));
            return await zFramework.Database.Query('INSERT INTO players (money, dirtyMoney, model, location, level, rank, players.group, dead, job, job_rank, inventory, needs, license, discord, ip, players.identity, skin, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', playerData).then(() => {
				console.log(`\x1b[33m[zFramework]\x1b[37m ${this._name} created in the DB.`);
			});
        }
        
        return await zFramework.Database.Query('UPDATE players SET money = ?, dirtyMoney = ?, model = ?, location = ?, level = ?, rank = ?, players.group = ?, dead = ?, job = ?, job_rank = ?, inventory = ?, needs = ? WHERE license = ?', playerData).then(() => {
            console.log(`\x1b[33m[zFramework]\x1b[37m Saved ${this._name}!`);
        });
    }
}
