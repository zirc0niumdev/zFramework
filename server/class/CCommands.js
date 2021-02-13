export default class CCommands {
	constructor(name, group, next, suggestion, onlyPlayer = false) {
		this._name		 = name;
		this._group 	 = group;
		this._suggestion = suggestion;
		this._onlyPlayer = onlyPlayer;
	
		if (!this._suggestion.arguments) this._suggestion.arguments = {};
		if (!this._suggestion.help) this._suggestion.help = '';

		RegisterCommand(this._name, async (source, args) => {
			zFramework.Commands[this._name] = this._suggestion;
			if (this._onlyPlayer && source == 0) return console.log("Commande disponible seulement pour les joueurs.");
			next(source > 0 ? await zFramework.Functions.GetPlayerFromId(source) : source, args);
		}, true);

		ExecuteCommand(`add_ace group.${this._group} command.${this._name} allow`);
	}
};