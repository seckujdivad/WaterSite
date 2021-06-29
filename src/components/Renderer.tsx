import React, {RefObject} from "react";
import memoizeOne from "memoize-one";

import styles from "./Renderer.module.css";

import Model from "../rendering/model/Model";
import GLModel from "../rendering/model/GLModel";
import Engine from "../rendering/Engine";
import Camera from "../rendering/Camera";


interface IProps
{
	models: Array<Model>;
	camera: Camera;
};

interface IState
{
	canvas_ref: RefObject<HTMLCanvasElement>;
	render_timer_id: number;
};

//fix - ref doesn't change but underlying values do
let GLModelsFromModelsCached = memoizeOne(function (context: WebGL2RenderingContextStrict, models: Array<Model>): Array<GLModel>
{
	return models.map(model => new GLModel(context, model));
});

let getEngine = memoizeOne(context => new Engine(context));

class Renderer extends React.Component<IProps, IState>
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
		const context: WebGL2RenderingContext = this.state.canvas_ref.current.getContext("webgl2");
		const strict_context = context as any as WebGL2RenderingContextStrict;
		const engine = getEngine(strict_context);
		let models = GLModelsFromModelsCached(engine.getContext(), this.props.models);
		engine.render(models, this.props.camera);
	}
}

export default Renderer;