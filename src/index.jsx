import React from "react";
import ReactDOM from "react-dom";

import App from "./App.jsx";
import Renderer from "./Renderer.js";

async function QueryShaders()
{
	let [vertex_shader_req, fragment_shader_req] = await Promise.all([fetch("water.vert"), fetch("water.frag")]);
	let [vertex_shader, fragment_shader] = await Promise.all([vertex_shader_req.text(), fragment_shader_req.text()]);
	return {vertex: vertex_shader, fragment: fragment_shader};
}

let reference = React.createRef();
ReactDOM.render(<App ref={reference} />, document.getElementById("root"));
const app = reference.current;

//webgl
const canvas = document.getElementById("glcanvas");
const context = canvas.getContext("webgl2");

const Initialiser = function (app, context, window, shaders)
{
	const renderer = new Renderer(app, context, shaders.vertex, shaders.fragment);

	const OnClose = function(renderer, event)
	{
		renderer.Destroy();
	}
	window.onclose = OnClose.bind(this, renderer)
}

QueryShaders().then(Initialiser.bind(this, app, context, window));