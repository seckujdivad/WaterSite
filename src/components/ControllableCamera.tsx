import React from "react";

import {vec3} from "gl-matrix";

import Camera from "../rendering/Camera";
import rotateVector from "../rendering/TranslateLocally";

interface IProps
{
	camera: Camera;
	lookSpeed: number;
	moveSpeed: number;
	onCameraChanged?: (camera: Camera) => void;
	updateInterval: number;
};

interface IState {};

interface IKeyStates
{
	w: boolean;
	s: boolean;
	d: boolean;
	a: boolean;
	shift: boolean;
	control: boolean;
};

const defaultKeyStates: IKeyStates = {
	w: false,
	s: false,
	d: false,
	a: false,
	shift: false,
	control: false
};

class ControllableCamera extends React.PureComponent<IProps, IState>
{
	_key_states: IKeyStates;
	_timer_id: number;

	constructor(props: IProps)
	{
		super(props);

		this.state = {};

		this._timer_id = null;
		this._key_states = Object.assign({}, defaultKeyStates);
	}

	render()
	{
		return <div
			tabIndex={0}
			onClick={this.onClicked.bind(this)}
			onMouseMove={this.onMouseMove.bind(this)}
			onKeyDown={this.onKey.bind(this, true)}
			onKeyUp={this.onKey.bind(this, false)}>
			{this.props.children}
		</div>;
	}

	onMouseMove(event: React.MouseEvent<HTMLDivElement>)
	{
		if (this.cameraIsBeingControlled)
		{

		}
	}

	onClicked(event: React.MouseEvent<HTMLDivElement>)
	{
		this.setControlCamera(true);
	}

	onKey(down: boolean, event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (this.cameraIsBeingControlled)
		{
			if (down && event.key === "Escape")
			{
				this.setControlCamera(false);
			}
			else if (event.key === "w")
			{
				this._key_states.w = down;
			}
			else if (event.key === "s")
			{
				this._key_states.s = down;
			}
			else if (event.key === "d")
			{
				this._key_states.d = down;
			}
			else if (event.key === "a")
			{
				this._key_states.a = down;
			}
			else if (event.key === "Shift")
			{
				this._key_states.shift = down;
			}
			else if (event.key === "Control")
			{
				this._key_states.control = down;
			}
		}
	}

	setControlCamera(enable: boolean)
	{
		if (enable && this._timer_id === null)
		{
			this._timer_id = window.setInterval(this.movementLoop.bind(this), this.props.updateInterval);
		}
		else if (!enable && this._timer_id !== null)
		{
			Object.assign(this._key_states, defaultKeyStates);
			window.clearInterval(this._timer_id);
			this._timer_id = null;
		}
	}

	componentWillUnmount()
	{
		this.setControlCamera(false);
	}

	get cameraIsBeingControlled(): boolean
	{
		return this._timer_id !== null;
	}

	movementLoop()
	{
		if (this.cameraIsBeingControlled && this.props.camera !== null)
		{
			let translation = vec3.create();

			if (this._key_states.w)
			{
				vec3.add(translation, translation, vec3.fromValues(0, 0, -1));
			}

			if (this._key_states.s)
			{
				vec3.add(translation, translation, vec3.fromValues(0, 0, 1));
			}

			if (this._key_states.d)
			{
				vec3.add(translation, translation, vec3.fromValues(1, 0, 0));
			}
			
			if (this._key_states.a)
			{
				vec3.add(translation, translation, vec3.fromValues(-1, 0, 0));
			}
			
			if (this._key_states.shift)
			{
				vec3.add(translation, translation, vec3.fromValues(0, 1, 0));
			}
			
			if (this._key_states.control)
			{
				vec3.add(translation, translation, vec3.fromValues(0, -1, 0));
			}

			vec3.scale(translation, translation, this.props.moveSpeed);
			rotateVector(translation, this.props.camera.rotation);
			vec3.add(this.props.camera.position, this.props.camera.position, translation);

			if (this.props.onCameraChanged !== undefined)
			{
				this.props.onCameraChanged(this.props.camera);
			}
		}
	}
};

export default ControllableCamera;