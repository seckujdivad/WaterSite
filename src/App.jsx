import React from "react";

import SceneLayer from "./SceneLayer.jsx";


class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			layers: [{transparency: 0.5}]
		};
	}

	render()
	{
		let layer_components = [];
		for (let i = 0; i < this.state.layers.length; i++)
		{
			layer_components.push(<SceneLayer key={i} transparency={this.state.layers[i].transparency} onTransparencyChange={this.updateLayerTransparency.bind(this, i)}></SceneLayer>)
		}

		return <div>{layer_components}</div>;
	}

	updateLayerTransparency(index, transparency)
	{
		this.setState(function (state)
		{
			state.layers[index].transparency = transparency;
			return state;
		});
	}
};


export default App;