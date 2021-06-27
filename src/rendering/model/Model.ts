import {vec3, vec2, mat4} from "gl-matrix";


class Model
{
	_faces: Array<Face>;

	position: vec3;
	rotation: vec3;
	scale: vec3;

	constructor(position: vec3 = vec3.fromValues(0, 0, 0), rotation: vec3 = vec3.fromValues(0, 0, 0), scale: vec3 = vec3.fromValues(1, 1, 1), faces: Array<Face> = [])
	{
		this.position = position;
		this.rotation = rotation;
		this.scale = scale;

		this._faces = faces;
	};

	toArray(): Array<number>
	{
		let nums_from_each_triangle = this._faces.map(triangle => triangle.toArray());
		return [].concat(...nums_from_each_triangle);
	}

	getFaces(): Array<Face>
	{
		return this._faces;
	}

	addFace(face: Face): void
	{
		this._faces.push(face);
	}

	get num_triangles(): number
	{
		let num_triangles = 0;
		for (const face of this.getFaces())
		{
			num_triangles += face.numTriangles();
		}
		return num_triangles;
	}

	get num_vertices(): number
	{
		return this.num_triangles * 3;
	}

	getTransformation(): mat4
	{
		let transformation: mat4 = mat4.create();

		mat4.scale(transformation, transformation, this.scale);
		
		mat4.rotateX(transformation, transformation, this.rotation[0]);
		mat4.rotateY(transformation, transformation, this.rotation[1]);
		mat4.rotateZ(transformation, transformation, this.rotation[2]);

		mat4.translate(transformation, transformation, this.position);

		return transformation;
	}
};

class Face
{
	vertices: Array<Vertex>;
	normal: vec3;
	
	constructor(normal: vec3, vertices: Array<Vertex> = [])
	{
		this.vertices = vertices;

		this.normal = normal;
	}

	toArray(): Array<number>
	{
		let tangent = this.tangent;

		let vertices: Array<Vertex> = [];
		for (let i = 2; i < this.vertices.length; i++)
		{
			vertices.push(this.vertices[0]);
			vertices.push(this.vertices[i - 1]);
			vertices.push(this.vertices[i]);
		}

		let nums_from_each_vertex = vertices.map(
			function (this: Face, vertex: Vertex)
			{
				let values = vertex.toArray();
				values.push(this.normal[0], this.normal[1], this.normal[2]);
				values.push(tangent[0], tangent[1], tangent[2]);
				return values;
			}.bind(this));
		return [].concat(...nums_from_each_vertex);
	}

	get tangent(): vec3
	{
		// https://learnopengl.com/Advanced-Lighting/Normal-Mapping
		let edge_1 = vec3.create();
		vec3.subtract(edge_1, this.vertices[1].position, this.vertices[0].position);
		let edge_2 = vec3.create();
		vec3.subtract(edge_2, this.vertices[2].position, this.vertices[0].position);

		let delta_uv_1 = vec2.create();
		vec2.subtract(delta_uv_1, this.vertices[1].uv, this.vertices[0].uv);
		let delta_uv_2 = vec2.create();
		vec2.subtract(delta_uv_2, this.vertices[2].uv, this.vertices[0].uv);

		let scale_factor = 1 / ((delta_uv_1[0] * delta_uv_2[1]) - (delta_uv_2[0] * delta_uv_1[1]));

		let tangent = vec3.fromValues(
			scale_factor * ((delta_uv_2[1] * edge_1[0]) - (delta_uv_1[1] * edge_2[0])),
			scale_factor * ((delta_uv_2[1] * edge_1[1]) - (delta_uv_1[1] * edge_2[1])),
			scale_factor * ((delta_uv_2[1] * edge_1[2]) - (delta_uv_1[1] * edge_2[2]))
		);

		return tangent;
	}

	numTriangles()
	{
		return this.vertices.length - 2;
	}
};

class Vertex
{
	position: vec3;
	uv: vec2;

	constructor(position: vec3 = vec3.fromValues(0, 0, 0), uv: vec2 = vec2.fromValues(0, 0))
	{
		this.position = position;
		this.uv = uv;
	};

	toArray(): Array<number>
	{
		let result: Array<number> = [];
		result.push(this.position[0], this.position[1], this.position[2]);
		result.push(this.uv[0], this.uv[1]);

		return result;
	}
};

export {Model as default, Face, Vertex};