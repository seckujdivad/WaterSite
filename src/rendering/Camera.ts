import {mat4, vec3} from "gl-matrix";


class Camera
{
	position: vec3;
	rotation: vec3;

	vfov: number; //vertical field of view, radians

	constructor(position: vec3, rotation: vec3, vfov: number)
	{
		this.position = position;
		this.rotation = rotation;
		this.vfov = vfov;
	}

	getTransformation(): mat4
	{
		let transformation: mat4 = mat4.create();

		mat4.rotateX(transformation, transformation, 0 - this.rotation[0]);
		mat4.rotateY(transformation, transformation, 0 - this.rotation[1]);
		mat4.rotateZ(transformation, transformation, 0 - this.rotation[2]);

		let translate_vec = vec3.create();
		vec3.subtract(translate_vec, vec3.create(), this.position);
		mat4.translate(transformation, transformation, translate_vec);
		return transformation;
	}
}

export default Camera;