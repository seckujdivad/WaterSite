import React from "react";

import styles from "./App.module.css";
import SceneLayer from "./SceneLayer.jsx";


class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			layers: [
				{
					transparency: 0.5,
					colour: "#6060FF"
				},
				{
					transparency: 0.5,
					colour: "#6060FF"
				}
			]
		};
	}

	render()
	{
		let layer_components = [];
		for (let i = 0; i < this.state.layers.length; i++)
		{
			const layer = this.state.layers[i];
			layer_components.push(<SceneLayer key={i} row={i} numRows={this.state.layers.length} onMovePressed={this.moveRow.bind(this, i)}
				transparency={layer.transparency} onTransparencyChange={this.updateLayerTransparency.bind(this, i)}
				colour={layer.colour} onColourChange={this.updateLayerColour.bind(this, i)}
				></SceneLayer>)
		}

		return <div className={styles.App}>{layer_components}</div>;
	}

	updateLayerTransparency(index, transparency)
	{
		this.setState(function (state)
		{
			state.layers[index].transparency = transparency;
			return state;
		});
	}

	updateLayerColour(index, colour)
	{
		this.setState(function (state)
		{
			state.layers[index].colour = colour;
			return state;
		})
	}

	getLayers()
	{
		return JSON.parse(JSON.stringify(this.state.layers)); //I wish there was a better way to deep copy
	}

	moveRow(row_index, move_up)
	{
		this.setState(function (state)
		{
			let swap_index = move_up ? row_index - 1 : row_index + 1;
			let swap = state.layers[swap_index];
			state.layers[swap_index] = state.layers[row_index];
			state.layers[row_index] = swap;
			return state;
		});
	}
};


export default App;