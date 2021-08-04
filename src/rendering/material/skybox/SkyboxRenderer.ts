import {mat4} from "gl-matrix";

import IRenderer from "../IRenderer";
import SkyboxMaterial from "./SkyboxMaterial";
import ShaderProgram, {loadShaderProgram} from "../ShaderProgram";
import RendererJob from "../RendererJob";

class SkyboxRenderer implements IRenderer<SkyboxMaterial>
{
	_context: WebGL2RenderingContextStrict;
	_shader_program: ShaderProgram;

	constructor(context: WebGL2RenderingContextStrict)
	{
		this._context = context;

		this._shader_program = null;
		this.loadShaderProgram();
	}

	render(job: RendererJob<SkyboxMaterial>): void
	{
		const gl = this._context;

		if (this._shader_program !== null)
		{
			this._shader_program.use();

			let perspective = mat4.create();
			mat4.perspective(perspective, job.camera.vfov, gl.canvas.width / gl.canvas.height, 0.1, 100);
			gl.uniformMatrix4fv(this._shader_program.getUniform("perspective"), false, perspective);

			gl.uniformMatrix4fv(this._shader_program.getUniform("rotationCamera"), false, job.camera.getRotation());

			//perform render
			for (let i = 0; i < job.models.length; i++)
			{
				const [model, glmodel] = job.models[i];

				this._shader_program.addTexture("skyboxTexture", job.texture_manager.getTexture(model.material.skybox_cubemap));

				glmodel.bind();

				gl.drawArrays(gl.TRIANGLES, 0, model.getNumVertices());
			}
		}
	}

	async loadShaderProgram()
	{
		this._shader_program = await loadShaderProgram(this._context, "./skybox.vert", "./skybox.frag");

		this._shader_program.addUniform("perspective");
		this._shader_program.addUniform("rotationCamera");
	}
}

export default SkyboxRenderer;