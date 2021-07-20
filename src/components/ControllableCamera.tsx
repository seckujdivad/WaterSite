import React from "react";

import {vec3} from "gl-matrix";

import Camera from "../rendering/Camera";
import rotateVector from "../rendering/TranslateLocally";
import keyMonitor from "../KeyMonitor";

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

	constructor(props: IProps)
	{
		super(props);

		this.state = {};

		this._timer_id = null;
	}

	render()
	{
		return <div
			tabIndex={0}
			onClick={this.onClicked.bind(this)}
			onMouseMove={this.onMouseMove.bind(this)}>
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

	setControlCamera(enable: boolean)
	{
		if (enable && this._timer_id === null)
		{
			this._timer_id = window.setInterval(this.movementLoop.bind(this), this.props.updateInterval);
		}
		else if (!enable && this._timer_id !== null)
		{
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
		if (this.cameraIsBeingControlled)
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

				vec3.scale(translation, translation, this.props.moveSpeed);
				rotateVector(translation, this.props.camera.rotation);
				vec3.add(this.props.camera.position, this.props.camera.position, translation);

				if (this.props.onCameraChanged !== undefined)
				{
					this.props.onCameraChanged(this.props.camera);
				}
			}
		}
	}
};

export default ControllableCamera;