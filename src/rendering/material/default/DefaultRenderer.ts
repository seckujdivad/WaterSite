import {mat4} from "gl-matrix";

import IRenderer from "../IRenderer";
import DefaultMaterial from "./DefaultMaterial";
import ShaderProgram, {loadShaderProgram} from "../ShaderProgram";
import RendererJob from "../RendererJob";


class DefaultRenderer implements IRenderer<DefaultMaterial>
{
	_context: WebGL2RenderingContextStrict;
	_shader_program: ShaderProgram;

	constructor(context: WebGL2RenderingContextStrict)
	{
		this._context = context;

		this._shader_program = null;
		this.loadShaderProgram();
	}

	render(job: RendererJob<DefaultMaterial>): void
	{
		const gl = this._context;

		if (this._shader_program !== null)
		{
			this._shader_program.use();

			//set up uniforms
			let perspective = mat4.create();
			mat4.perspective(perspective, job.camera.vfov, gl.canvas.width / gl.canvas.height, 0.1, 100);
			gl.uniformMatrix4fv(this._shader_program.getUniform("perspective"), false, perspective);

			gl.uniformMatrix4fv(this._shader_program.getUniform("transformationCamera"), false, job.camera.getTransformation());
			
			//perform render
			for (let i = 0; i < job.models.length; i++)
			{
				const [model, glmodel] = job.models[i];

				this._shader_program.addTexture("textureColour", job.texture_manager.getTexture(model.material.colour));
				this._shader_program.addTexture("textureNormal", job.texture_manager.getTexture(model.material.normal));

				glmodel.bind();

				gl.uniformMatrix4fv(this._shader_program.getUniform("transformationModel"), false, model.getTransformation());
				gl.drawArrays(gl.TRIANGLES, 0, model.getNumVertices());
			}
		}
	}

	async loadShaderProgram()
	{
		this._shader_program = await loadShaderProgram(this._context, "./normal.vert", "./normal.frag");

		this._shader_program.addUniform("transformationCamera");
		this._shader_program.addUniform("transformationModel");
		this._shader_program.addUniform("perspective");
	}
}

export default DefaultRenderer;