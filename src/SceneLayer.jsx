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

		return <>
				Transparent
				<input type="range" min="0" max="1" step="0.001" value={transparency} onChange={this.onTransparencyChange.bind(this)}></input>
				Opaque
			</>;
	};

	onTransparencyChange(event)
	{
		if (this.props.onTransparencyChange !== undefined)
		{
			this.props.onTransparencyChange(parseFloat(event.target.value));
		}
	}
};


export default SceneLayer;