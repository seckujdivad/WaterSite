import React, {RefObject} from "react";

import styles from "./App.module.css";

import SceneLayer from "./SceneLayer";
import Vector from "./Vector";
import Viewport from "./Viewport";
import ControllableCamera from "./ControllableCamera";

import {vec3ToArray, arrayToVec3, vecToString} from "../vectorutils";
import Model from "../rendering/model/Model";
import Camera from "../rendering/Camera";
import {getModels, getCamera} from "../scene";


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

	models: Array<Model>;
	selected_model: Model;
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

			camera: getCamera(),
			models: getModels(model => this.setState({})),
			selected_model: null
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
				colour={layer.colour} onColourChange={this.updateLayerColour.bind(this, i)} />);
		}

		let cameraControls = <div className={styles.VectorControlsBody}>
			<div className={styles.VectorControl}>
				<div className={styles.VectorControlHeader}>Position</div>
				<Vector className={styles.VectorControlVector} onChange={this.moveCamera.bind(this)} values={vec3ToArray(this.state.camera.position)}
					defaultStyle={{min: -10, max: 10, step: 0.01}}
					styles={[
						{label: "X"},
						{label: "Y"},
						{label: "Z"}
					]} />
			</div>
			<div className={styles.VectorControl}>
				<div className={styles.VectorControlHeader}>Rotation</div>
				<Vector className={styles.VectorControlVector} onChange={this.rotateCamera.bind(this)} values={vec3ToArray(this.state.camera.rotation)}
					defaultStyle={{min: -2 * Math.PI, max: 2 * Math.PI, step: 0.01}}
					styles={[
						{label: "X"},
						{label: "Y"},
						{label: "Z"}
					]} />
			</div>
		</div>;
		
		let hasModelSelected = this.state.selected_model !== null;
		let modelPosition = hasModelSelected ? vec3ToArray(this.state.selected_model.position) : [0, 0, 0];
		let modelRotation = hasModelSelected ? vec3ToArray(this.state.selected_model.rotation) : [0, 0, 0];
		let modelScale = hasModelSelected ? vec3ToArray(this.state.selected_model.scale) : [1, 1, 1];

		let modelControls = <div className={styles.VectorControlsBody}>
			<div className={styles.VectorControl}>
				<div className={styles.VectorControlHeader}>Position</div>
				<Vector className={styles.VectorControlVector} onChange={this.moveModel.bind(this)} values={modelPosition}
					disabled={!hasModelSelected} defaultStyle={{min: -10, max: 10, step: 0.01}}
					styles={[
						{label: "X"},
						{label: "Y"},
						{label: "Z"}
					]} />
			</div>
			<div className={styles.VectorControl}>
				<div className={styles.VectorControlHeader}>Rotation</div>
				<Vector className={styles.VectorControlVector} onChange={this.rotateModel.bind(this)} values={modelRotation}
					disabled={!hasModelSelected} defaultStyle={{min: -2 * Math.PI, max: 2 * Math.PI, step: 0.01}}
					styles={[
						{label: "X"},
						{label: "Y"},
						{label: "Z"}
					]} />
			</div>
			<div className={styles.VectorControl}>
				<div className={styles.VectorControlHeader}>Scale</div>
				<Vector className={styles.VectorControlVector} onChange={this.scaleModel.bind(this)} values={modelScale}
					disabled={!hasModelSelected} defaultStyle={{min: 0, max: 10, step: 0.01}}
					styles={[
						{label: "X"},
						{label: "Y"},
						{label: "Z"}
					]} />
			</div>
		</div>;
		
		let selected_model_index = -1;
		let model_options = [<option key={-1} value={-1} style={{display: "none"}}>No model selected</option>];
		for (let i = 0; i < this.state.models.length; i++)
		{
			let model = this.state.models[i];
			model_options.push(<option key={i} value={i}>{model.faces.length + " faces, " + model.getNumVertices() + " vertices @ " + vecToString(model.position, 1)}</option>);

			if (model === this.state.selected_model)
			{
				selected_model_index = i;
			}
		}
		
		let modelSelection = <select value={selected_model_index} onChange={this.newModelSelected.bind(this)} className={styles.ModelSelection}>{model_options}</select>;

		return <>
			<div className={styles.App}>{layer_components}</div>
			<ControllableCamera
				camera={this.state.camera} moveSpeed={0.02} lookSpeed={3} updateInterval={10}
				onCameraChanged={((camera: Camera) => this.setState({camera: camera})).bind(this)}>
				<Viewport models={this.state.models} camera={this.state.camera} />
			</ControllableCamera>
			<div className={styles.VectorControls}>
				<div className={styles.VectorControlsHeader}>Camera</div>
				{cameraControls}
				<div className={styles.VectorControlsHeader}>Model</div>
				{modelControls}
			</div>
			{modelSelection}
			<button className={styles.ResetButton} onClick={this.resetScene.bind(this)}>Reset</button>
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

	rotateCamera(values: Array<number>)
	{
		this.setState(function (state)
		{
			state.camera.rotation = arrayToVec3(values);
			return state;
		});
	}

	moveModel(values: Array<number>)
	{
		this.setState(function (state)
		{
			if (state.selected_model !== null)
			{
				state.selected_model.position = arrayToVec3(values);
			}
			return state;
		});
	}

	rotateModel(values: Array<number>)
	{
		this.setState(function (state)
		{
			if (state.selected_model !== null)
			{
				state.selected_model.rotation = arrayToVec3(values);
			}
			return state;
		});
	}

	scaleModel(values: Array<number>)
	{
		this.setState(function (state)
		{
			if (state.selected_model !== null)
			{
				state.selected_model.scale = arrayToVec3(values);
			}
			return state;
		});
	}

	newModelSelected(event: React.ChangeEvent<HTMLInputElement>)
	{
		let selected_index = parseInt(event.target.value);
		this.setState(function (state)
		{
			return {selected_model: state.models[selected_index]};
		});
	}

	resetScene()
	{
		this.setState({
			models: getModels(),
			camera: getCamera(),
			selected_model: null
		});
	}
};

export default App;