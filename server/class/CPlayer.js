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
        this._needs          = data.playerNeeds;
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
    * @param {object} data
    */
    set needs(data) {
        for (const type in data) this._needs[type] = data[type];
        
        this.clientEvent('Client.UpdateVar', "needs", this._needs);
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

    setItemData = (name, key, value) => {
        const item = zFramework.Core.Items.GetItem(name);
        const hasItem = zFramework.Core.Inventory.HasItem(this._inventory, name, item.type);
        console.log(item, hasItem);
        if (hasItem) {
            const itemIndex = zFramework.Core.Inventory.FindItem(this._inventory, name, item.type);

            this._inventory[item.type][itemIndex]["data"][key] = value;
    
            this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
        }
    };

    changeWeaponSlot = (key, value) => {
        this._inventory[key] = value;

        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    };

    addItem = (name, qty = 1, data = {}) => {
        if (typeof(qty) !== "number") qty = parseInt(qty);

        if (!this.canCarryItem(name, qty)) return this.notify("~r~Vous ne pouvez pas porter plus sur vous.");

        const item = zFramework.Core.Items.GetItem(name);
        const hasItem = zFramework.Core.Inventory.HasItem(this._inventory, item.name, item.type);

        // stack management
        if (hasItem) {
            const itemIndex = zFramework.Core.Inventory.FindItem(this._inventory, item.name, item.type);
            this._inventory[item.type][itemIndex].qty += qty;
        } else this._inventory[item.type].push({ name, base: name, data, qty });

        // weight management
        if (item.weight) this._inventory.weight += item.weight * qty;
        
        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    canCarryItem = (name, qty) => {
        const item = zFramework.Core.Items.GetItem(name);
        if (this._inventory.weight + item.weight * qty > zFramework.Core.Inventory.PlayerWeight) return false;

        return true;
    }

    deleteItem = (name, qty = 1) => {
        if (typeof(qty) !== "number") qty = parseInt(qty);

        const item = zFramework.Core.Items.GetItem(name);
        const hasItem = zFramework.Core.Inventory.HasItem(this._inventory, item.name, item.type);
        const itemIndex = zFramework.Core.Inventory.FindItem(this._inventory, item.name, item.type);
        if (!hasItem) return;

        // stack management
        this._inventory[item.type][itemIndex].qty -= qty;
        if (this._inventory[item.type][itemIndex].qty <= 0) this._inventory[item.type].splice(itemIndex, 1);

        // weight management
        if (item.weight) this._inventory.weight -= item.weight * qty;

        const weaponSlot = zFramework.Core.Inventory.FindItemInSlot(this._inventory, name);
        if (weaponSlot) this._inventory[weaponSlot] = "";
        
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

        let playerData = [this._model, JSON.stringify({x: this.getLocation().x, y: this.getLocation().y, z: this.getLocation().z, heading: parseFloat(GetEntityHeading(this.pedId).toFixed(2))}), this._level, this._rank, this._group, this._dead, this._job["id"], this._jobRank, JSON.stringify(this._inventory), JSON.stringify(this._needs), this._licenseId];
        if (this._firstSpawn) {
            playerData.push(this._discordId, GetPlayerEndpoint(this._serverId), JSON.stringify(this._identity), JSON.stringify(this._skin));
            return await zFramework.Database.Query('INSERT INTO players (model, location, level, rank, players.group, dead, job, job_rank, inventory, needs, license, discord, ip, players.identity, skin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', playerData).then(() => {
				console.log(`\x1b[33m[zFramework]\x1b[37m ${this._name} created in the DB.`);
			});
        }
        
        return await zFramework.Database.Query('UPDATE players SET model = ?, location = ?, level = ?, rank = ?, players.group = ?, dead = ?, job = ?, job_rank = ?, inventory = ?, needs = ? WHERE license = ?', playerData).then(() => {
            console.log(`\x1b[33m[zFramework]\x1b[37m Saved ${this._name}!`);
        });
    }
}
