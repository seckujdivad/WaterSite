import React from "react";

import styles from "./App.module.css";
import SceneLayer from "./SceneLayer.jsx";
import Renderer from "./Renderer";


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
			],

			canvas_ref: React.createRef(),
			get canvas()
			{
				return this.canvas_ref.current;
			}
		};

		const createRenderer = function (window, shaders)
		{
			const context = this.state.canvas.getContext("webgl2");
			const renderer = new Renderer(this, context, shaders.vertex, shaders.fragment);

			const OnClose = function(renderer, event)
			{
				renderer.Destroy();
			}
			window.onclose = OnClose.bind(this, renderer);

			window.setInterval(renderer.Render.bind(renderer), 10); //10 ms
		}

		queryShaders().then(createRenderer.bind(this, window));
	}

	render()
	{
		let layer_components = [];
		for (let i = 0; i < this.state.layers.length; i++)
		{
			const layer = this.state.layers[i];
			layer_components.push(
					<SceneLayer key={i} row={i} numRows={this.state.layers.length} onMovePressed={this.moveRow.bind(this, i)}
					transparency={layer.transparency} onTransparencyChange={this.updateLayerTransparency.bind(this, i)}
					colour={layer.colour} onColourChange={this.updateLayerColour.bind(this, i)} />
				);
		}

		return <>
				<div className={styles.App}>{layer_components}</div>
				<canvas className={styles.glcanvas} ref={this.state.canvas_ref} />
			</>;
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

async function queryShaders()
{
	let [vertex_shader_req, fragment_shader_req] = await Promise.all([fetch("water.vert"), fetch("water.frag")]);
	let [vertex_shader, fragment_shader] = await Promise.all([vertex_shader_req.text(), fragment_shader_req.text()]);
	return {vertex: vertex_shader, fragment: fragment_shader};
}

export default App;