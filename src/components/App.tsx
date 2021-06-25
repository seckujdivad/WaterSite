import React, {RefObject} from "react";
import {vec3} from "gl-matrix";

import styles from "./App.module.css";
import SceneLayer from "./SceneLayer";
import Renderer from "./../rendering/Renderer";


interface IProps {};

interface IState
{
	layers: Array<{
		transparency: number,
		colour: string
	}>;
	canvas_ref: RefObject<HTMLCanvasElement>;
	canvas: HTMLCanvasElement;

	camera: {
		position: vec3;
	}
};

class App extends React.Component<IProps, IState>
{
	constructor(props: IProps)
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
			get canvas(): HTMLCanvasElement
			{
				return this.canvas_ref.current;
			},

			camera: {
				position: vec3.fromValues(0, 0, 0)
			}
		};

		const createRenderer = function (shaders: {vertex: string, fragment: string})
		{
			const context = this.state.canvas.getContext("webgl2");
			const renderer = new Renderer(context, shaders.vertex, shaders.fragment);

			window.setInterval(renderer.render.bind(renderer), 10); //10 ms
		}

		queryShaders().then(createRenderer.bind(this));
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

	updateLayerTransparency(index: number, transparency: number)
	{
		this.setState(function (state: IState): IState
		{
			state.layers[index].transparency = transparency;
			return state;
		});
	}

	updateLayerColour(index: number, colour: string)
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

	moveRow(row_index: number, move_up: boolean)
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

	moveCamera(axis_index: number, value: number)
	{
		this.setState(function (state)
		{
			state.camera.position[axis_index] = value;
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