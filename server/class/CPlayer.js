import Vector3 from "../../shared/class/CVector3";

export default class CPlayer {
    constructor(data) {
        data = JSON.parse(data);

        this._serverId       = data.serverId;
        this._pedId          = data.pedId;
        this._uuid           = data.UUID;
        this._name           = data.name;
        this._spawnLocation  = data.spawnLocation;
        this._model          = data.model;
        this._sex            = data.sex;
        this._money          = data.money;
        this._dirtyMoney     = data.dirtyMoney;
        this._bank           = data.bank;
        this._character      = data.character;
        this._needs          = data.needs;
        this._inventory      = data.inventory;
        this._licenses       = data.licenses;
        this._dead           = data.dead;
        this._rank           = data.rank;
        this._group          = data.group;
        this._job            = data.job;
        this._jobRank        = data.jobRank;
        this._firstSpawn     = data.firstSpawn;
        this._initialized    = false;

        ExecuteCommand(`add_principal identifier.${this._licenses.rockstar} group.${this._group}`);

        this.clientEvent('Client.CreatePlayer', JSON.stringify(data));
    }

    /**
    */
    set pedId(id) {
        this._pedId = id;
    }

    /**
    * @param {String} name
    */
    set model(name) {
        this._model = name;
        this._pedId = GetPlayerPed(this._serverId);

        this.clientEvent('Client.UpdateVar', "model", this._model);
    }

    /**
    * @param {Number} num
    */
    set sex(num) {
        this._sex = num;

        this.clientEvent('Client.UpdateVar', "sex", this._sex);
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
    * @param {Number} amount
    */
    set bank(amount) {
        this._bank = amount;

        this.clientEvent('Client.UpdateVar', "bank", this._bank);
    }

    /**
    * @param {Object} data
    */
    set character(data) {
        this._character = data;

        this.clientEvent('Client.UpdateVar', "character", this._character);
    }

    /**
    * @param {Object} data
    */
    set needs(data) {
        for (const type in data) this._needs[type] = data[type];
        
        this.clientEvent('Client.UpdateVar', "needs", this._needs);
    }

    /**
    * @param {Object} data
    */
    set inventory(data) {
        this._inventory = data;

        this.clientEvent('Client.UpdateVar', "inventory", this._inventory);
    }

    /**
    * @param {Boolean} toggle
    */
    set dead(toggle) {
        this._dead = toggle;

        this.clientEvent('Client.UpdateVar', "dead", this._dead);
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
    set job(id)  {
        return (async () => {
            const job = await zFramework.Jobs.GetJobFromId(id);
            this._job = job;
    
            this.clientEvent('Client.UpdateVar', "job", this._job);
        })();
    }

    /**
    * @param {Number} id
    */
    set jobRank(id) {
        this._jobRank = id;

        this.clientEvent('Client.UpdateVar', "jobrank", this._jobRank);
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

    get pedId() {
        return this._pedId;
    }
    
    get UUID() {
        return this._uuid;
    }
    
    get name() {
        return this._name;
    }

    get spawnLocation() {
        return this._spawnLocation;
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

    get licenses() {
        return this._licenses;
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

    get firstSpawn() {
        return this._firstSpawn;
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

        this.clientEvent('Client.UpdateInventory', this.inventory, name);
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
    
        this.clientEvent('Client.UpdateInventory', this.inventory, name);
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
        this.inventory.items[name].splice(typeof(num) === "object" && num[0] || 0, typeof(num) === "object" && num.length || num);

        if (this.inventory.items[name].length <= 0) delete this.inventory.items[name];

        // weight management
        this._inventory.weight -= (item.weight || zFramework.Core.Inventory.DefaultWeight) * (typeof(num) === "object" && num.length || num);
        
        this.clientEvent('Client.UpdateInventory', this.inventory, name);
    }

    setLocation = (location) => {
        SetEntityCoords(this._pedId, location.x, location.y, location.z)
        if (location.heading || location.h) SetEntityHeading(this._pedId, location.heading);
    };

    getLocation = () => new Vector3(GetEntityCoords(this._pedId)[0].toFixed(2), GetEntityCoords(this._pedId)[1].toFixed(2), GetEntityCoords(this._pedId)[2].toFixed(2));

    getHeading = () => parseFloat(GetEntityHeading(this.pedId).toFixed(2));

    getIdentifiers = (minimal = false) => zFramework.Functions.GetIdentifiersFromId(this._serverId, minimal);

    kick = (reason = "Aucune raison spécifiée") => DropPlayer(this._serverId, reason);

    ban = (time, reason = "Aucune raison spécifiée") => ExecuteCommand(`bana ${this._serverId} ${time} ${reason}`);

    notify = (text) => this.clientEvent("Client.Notify", text);

    canSave = () => this._initialized && this._character;
    
    savePlayer = async () => {
        if (!this.canSave()) return;
        this._needs.health = GetEntityHealth(this._pedId);

        let query = "UPDATE players SET money = ?, dirtyMoney = ?, bank = ?, model = ?, sex = ?, location = ?, rank = ?, players.group = ?, dead = ?, job = ?, job_rank = ?, inventory = ?, needs = ?, character = ? WHERE rockstar = ?";
        const playerData = [this._money, this._dirtyMoney, this._bank, this._model, JSON.stringify({x: this.getLocation().x, y: this.getLocation().y, z: this.getLocation().z, heading: this.getHeading()}), this._rank, this._group, this._dead, this._job["id"], this._jobRank, JSON.stringify(this._inventory), JSON.stringify(this._needs), JSON.stringify(this._character), this._licenses.rockstar];
        if (this._firstSpawn) {
            playerData.push(this._licenses.discord, GetPlayerEndpoint(this._serverId), this._uuid);
            query = "INSERT INTO players (money, dirtyMoney, bank, model, sex, location, rank, players.group, dead, job, job_rank, inventory, needs, character, rockstar, discord, ip, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        }
        
        return await zFramework.Database.Query(query, playerData)
        .then(() => {
            if (!this._firstSpawn) zFramework.Functions.Logs(`\x1b[33m[zFramework]\x1b[37m Saved ${this._name}!`);
            else zFramework.Functions.Logs(`\x1b[33m[zFramework]\x1b[37m Created ${this._name} in the database.`);
        });
    }
}
