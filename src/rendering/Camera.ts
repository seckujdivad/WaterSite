import {mat4, vec3} from "gl-matrix";

import {applyRotation} from "../vectorutils";


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

	getRotation(inverse = true): mat4
	{
		return applyRotation(mat4.create(), this.rotation, inverse);
	}

	getTransformation(): mat4
	{
		let transformation = this.getRotation();
		let translate_vec = vec3.subtract(vec3.create(), vec3.create(), this.position);
		mat4.translate(transformation, transformation, translate_vec);
		return transformation;
	}
};

export default Camera;