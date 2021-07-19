class KeyMonitor
{
	_key_table: Map<string, boolean>;

	constructor()
	{
		this._key_table = new Map();

		window.addEventListener("keydown", this._onKey.bind(this, true));
		window.addEventListener("keyup", this._onKey.bind(this, false));
	}

	keyIsPressed(key_name: string)
	{
		if (this._key_table.has(key_name))
		{
			return this._key_table.get(key_name);
		}
		else
		{
			return false;
		}
	}

	_onKey(down: boolean, event: KeyboardEvent)
	{
		this._key_table.set(event.key, down);
	}
};

const keyMonitor = new KeyMonitor();

export default keyMonitor;