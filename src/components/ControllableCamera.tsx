import React, {RefObject} from "react";

import {mat4, vec3, vec2} from "gl-matrix";

import Camera from "../rendering/Camera";
import keyMonitor from "../KeyMonitor";
import {applyRotation} from "../vectorutils";


interface IProps
{
	camera: Camera;
	lookSpeed: number;
	moveSpeed: number;
	onCameraChanged?: (camera: Camera) => void;
	updateInterval: number;
};

interface IState {};

class ControllableCamera extends React.PureComponent<IProps, IState>
{
	_timer_id: number;
	_div_ref: RefObject<HTMLDivElement>;

	_listener_pointer_lock: (event: Event) => void;

	constructor(props: IProps)
	{
		super(props);

		this.state = {};

		this._timer_id = null;
		this._div_ref = React.createRef();

		this._listener_pointer_lock = this.onPointerLockChange.bind(this);
	}

	render()
	{
		return <div
			ref={this._div_ref}
			tabIndex={0}
			onClick={this.onClicked.bind(this)}
			onMouseMove={this.onMouseMove.bind(this)}>
			{this.props.children}
		</div>;
	}

	onMouseMove(event: React.MouseEvent<HTMLDivElement>)
	{
		if (this.hasCameraControl && this.props.camera !== null)
		{
			let div_dimensions = vec2.fromValues(this._div_ref.current.clientWidth, this._div_ref.current.clientHeight);
			if (div_dimensions[0] > 0 && div_dimensions[1] > 0)
			{
				let move_pixels = vec2.fromValues(event.movementX, event.movementY);
				if (move_pixels[0] !== 0 || move_pixels[1] !== 0)
				{
					let aspect_ratio = div_dimensions[0] / div_dimensions[1];
					let look_fraction = vec2.div(vec2.create(), move_pixels, div_dimensions);

					this.props.camera.rotation[1] -= this.props.lookSpeed * look_fraction[0] * this.props.camera.vfov * aspect_ratio;
					this.props.camera.rotation[0] -= this.props.lookSpeed * look_fraction[1] * this.props.camera.vfov;

					if (this.props.onCameraChanged !== undefined)
					{
						this.props.onCameraChanged(this.props.camera);
					}
				}
			}
		}
	}

	onClicked(event: React.MouseEvent<HTMLDivElement>)
	{
		this.setControlCamera(true);
	}

	setControlCamera(enable: boolean)
	{
		if (enable && this._timer_id === null)
		{
			this._timer_id = window.setInterval(this.movementLoop.bind(this), this.props.updateInterval);

			this._div_ref.current.requestPointerLock();
		}
		else if (!enable && this._timer_id !== null)
		{
			window.clearInterval(this._timer_id);
			this._timer_id = null;

			document.exitPointerLock();
		}
	}

	componentDidMount()
	{
		document.addEventListener("pointerlockchange", this._listener_pointer_lock);
	}

	componentWillUnmount()
	{
		document.removeEventListener("pointerlockchange", this._listener_pointer_lock);
		this.setControlCamera(false);
	}

	get hasCameraControl(): boolean
	{
		return this._timer_id !== null;
	}

	movementLoop()
	{
		if (this.hasCameraControl)
		{
			if (keyMonitor.keyIsPressed("Escape"))
			{
				this.setControlCamera(false);
			}

			if (this.props.camera !== null)
			{
				let translation = vec3.create();

				if (keyMonitor.keyIsPressed("w"))
				{
					vec3.add(translation, translation, vec3.fromValues(0, 0, -1));
				}

				if (keyMonitor.keyIsPressed("s"))
				{
					vec3.add(translation, translation, vec3.fromValues(0, 0, 1));
				}

				if (keyMonitor.keyIsPressed("d"))
				{
					vec3.add(translation, translation, vec3.fromValues(1, 0, 0));
				}
				
				if (keyMonitor.keyIsPressed("a"))
				{
					vec3.add(translation, translation, vec3.fromValues(-1, 0, 0));
				}
				
				if (keyMonitor.keyIsPressed("e"))
				{
					vec3.add(translation, translation, vec3.fromValues(0, 1, 0));
				}
				
				if (keyMonitor.keyIsPressed("q"))
				{
					vec3.add(translation, translation, vec3.fromValues(0, -1, 0));
				}

				if (!vec3.exactEquals(vec3.create(), translation))
				{
					vec3.scale(translation, translation, this.props.moveSpeed);
					vec3.transformMat4(translation, translation, applyRotation(mat4.create(), this.props.camera.rotation));
					vec3.add(this.props.camera.position, this.props.camera.position, translation);

					if (this.props.onCameraChanged !== undefined)
					{
						this.props.onCameraChanged(this.props.camera);
					}
				}
			}
		}
	}

	onPointerLockChange(event: Event)
	{
		if (this.hasPointerLock && !this.hasCameraControl)
		{
			this.setControlCamera(true);
		}
		else if (!this.hasPointerLock && this.hasCameraControl)
		{
			this.setControlCamera(false);
		}
	}

	get hasPointerLock(): boolean
	{
		return document.pointerLockElement === this._div_ref.current;
	}
};

export default ControllableCamera;