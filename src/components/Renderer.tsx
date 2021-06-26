import {mat4, vec3} from "gl-matrix";
import WebGLDebugUtils from "webgl-debug";
import React, {RefObject} from "react";
import memoizeOne from "memoize-one";

import styles from "./Renderer.module.css";

import Model from "../rendering/model/Model";
import GLModel, {GLModelFromModel} from "../rendering/model/GLModel";
import Engine from "../rendering/Engine";

interface IProps
{
	models: Array<Model>;
};

interface IState
{
	canvas_ref: RefObject<HTMLCanvasElement>;
	render_timer_id: number;
};

let getDebugContextCached = memoizeOne(WebGLDebugUtils.makeDebugContext as (context: WebGL2RenderingContext, callback: (error: number, function_name: string) => void) => WebGL2RenderingContext);

function WebGLErrorCallback(error: number, function_name: string)
{
	throw WebGLDebugUtils.glEnumToString(error) + " was caused by a call to: " + function_name;
};

let GLModelsFromModelsCached = memoizeOne(function (context: WebGL2RenderingContext, models: Array<Model>): Array<GLModel>
{
	return models.map(GLModelFromModel.bind(this, context));
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
		return <canvas ref={this.state.canvas_ref} className={styles.glcanvas}/>;
	}

	componentWillUnmount()
	{
		window.clearInterval(this.state.render_timer_id);
	}

	renderGL()
	{
		const engine = getEngine(this.state.canvas_ref.current.getContext("webgl2"));
		let models = GLModelsFromModelsCached(engine.getContext(), this.props.models);
		engine.render(models);
	}
}

export default Renderer;