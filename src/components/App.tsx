import React, {RefObject} from "react";
import {vec3} from "gl-matrix";

import styles from "./App.module.css";

import SceneLayer from "./SceneLayer";
import Vector from "./Vector";
import Renderer from "./Renderer";
import {vec3ToArray, arrayToVec3} from "./../vectorutils";
import ModelPresets, {modelFromPreset} from "../rendering/model/ModelPresets";
import Model from "../rendering/model/Model";
import Camera from "../rendering/Camera";


interface IProps {};

interface IState
{
	layers: Array<{
		transparency: number,
		colour: string
	}>;
	canvas_ref: RefObject<HTMLCanvasElement>;
	canvas: HTMLCanvasElement;

	camera: Camera;

	models: Array<Model>
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

			camera: new Camera(vec3.fromValues(0, 0, -3), vec3.create()),

			models: [modelFromPreset(new Model(), ModelPresets.FlatPlane)]
		};
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
				<Renderer models={this.state.models} camera={this.state.camera} />
				<div>
					<Vector onChange={this.moveCamera.bind(this)} values={vec3ToArray(this.state.camera.position)} styles={[
						{label: "Camera X", min: -10, max: 10, step: 0.01},
						{label: "Camera Y", min: -10, max: 10, step: 0.01},
						{label: "Camera Z", min: -10, max: 10, step: 0.01}
					]} />
				</div>
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

	moveCamera(values: Array<number>)
	{
		this.setState(function (state)
		{
			state.camera.position = arrayToVec3(values);
			return state;
		});
	}
};

export default App;