export default class CCommands {
	constructor(name, group, next, suggestion) {
		this._name		 = name;
		this._group 	 = group;
		this._suggestion = suggestion;
	
		if (!this._suggestion.arguments) this._suggestion.arguments = {};
		if (!this._suggestion.help) this._suggestion.help = '';

		RegisterCommand(this._name, async (source, args) => {
			zFramework.Commands[this._name] = this._suggestion;
			next(source > 0 ? await zFramework.Functions.GetPlayerFromId(source) : null, args, source);
		}, true);

		ExecuteCommand(`add_ace group.${this._group} command.${this._name} allow`);
	}
};