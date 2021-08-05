import React, {RefObject} from "react";
import memoizeOne from "memoize-one";

import styles from "./Viewport.module.css";

import Model from "../rendering/model/Model";
import Engine from "../rendering/Engine";
import Camera from "../rendering/Camera";
import IMaterial from "../rendering/material/IMaterial";


interface IProps
{
	models: Array<Model<IMaterial>>;
	camera: Camera;
};

interface IState
{
	canvas_ref: RefObject<HTMLCanvasElement>;
	render_timer_id: number;
};

let getEngine = memoizeOne(context => new Engine(context));

/**
 * Displays rendering output from Engine. Must be wrapped in a div or div-based component like ControllableCamera.
 */
class Viewport extends React.Component<IProps, IState>
{
	constructor(props: IProps)
	{
		super(props);

		this.state = {
			canvas_ref: React.createRef(),
			render_timer_id: window.setInterval(this.renderGL.bind(this), 10)
		};
	}

	render()
	{
		return <canvas ref={this.state.canvas_ref} className={styles.glcanvas} />;
	}

	componentWillUnmount()
	{
		window.clearInterval(this.state.render_timer_id);
	}

	renderGL()
	{
		this.state.canvas_ref.current.width = this.state.canvas_ref.current.parentElement.clientWidth;
		this.state.canvas_ref.current.height = this.state.canvas_ref.current.parentElement.clientHeight;

		const context: WebGL2RenderingContext = this.state.canvas_ref.current.getContext("webgl2");
		const strict_context = context as any as WebGL2RenderingContextStrict;
		const engine = getEngine(strict_context);
		engine.render(this.props.models, this.props.camera);
	}
};

export default Viewport;