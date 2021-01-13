export default class CCommands {
	constructor(name, group, cb, suggestion) {
		this._name		 = name;
		this._group 	 = group;
		this._suggestion = suggestion;

		this.register(cb);
	}

	//Getters
    get name() {
        return this._name;
    }

    get group() {
        return this._group;
    }

    get suggestion() {
        return this._suggestion;
	}
	
	register = (cb) => {
		if (!this._suggestion.arguments) this._suggestion.arguments = {};
		if (!this._suggestion.help) this._suggestion.help = '';
		emitNet('chat:addSuggestion', -1, `/${this._name}`, this._suggestion.help, this._suggestion.arguments);

		RegisterCommand(name, (source, args) => {
			cb(zFramework.Players[source] || null, args, source)
		}, true);

		ExecuteCommand(`add_ace group.${this._group} command.${this._name} allow`);
	}
};