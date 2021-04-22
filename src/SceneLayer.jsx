import React from "react";


class SceneLayer extends React.Component
{
	constructor(props)
	{
		super(props);
	};

	render()
	{
		let transparency = 0;
		if (this.props.transparency !== undefined)
		{
			transparency = this.props.transparency;
		}

		console.log(transparency);

		return <input type="range" min="0" max="1000" value={transparency*1000} onChange={this.onTransparencyChange.bind(this)}></input>;
	};

	onTransparencyChange(event)
	{
		if (this.props.onTransparencyChange !== undefined)
		{
			this.props.onTransparencyChange(parseFloat(event.target.value) / 1000);
		}
	}
};


export default SceneLayer;