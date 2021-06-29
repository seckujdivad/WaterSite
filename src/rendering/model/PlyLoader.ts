import {vec3, vec2} from "gl-matrix";
import Model, {Face, Vertex} from "./Model";

enum PlyType
{
	Float,
	ListInt
};

class Property
{
	name: string;
	type: PlyType;

	constructor(name: string, type: PlyType)
	{
		this.name = name;
		this.type = type;
	}
};

class Element
{
	name: string;
	num_occurrences: number;
	properties: Array<Property>;

	constructor(name: string, num_occurrences: number, properties: Array<Property> = [])
	{
		this.name = name;
		this.num_occurrences = num_occurrences;
		this.properties = properties;
	}
};

function loadPLYModel(model: Model, ply_contents: string): Model //this function is only written to work with Blender's PLY ouptut
{
	let ply_lines = ply_contents.replaceAll("\r", "").split("\n");
	let current_line_index = 0;

	//parse file type header
	if (ply_lines[current_line_index] !== "ply")
	{
		throw Error("Doesn't fit PLY format");
	}
	current_line_index += 1;

	if (ply_lines[current_line_index] !== "format ascii 1.0")
	{
		throw Error("Doesn't fit PLY format");
	}
	current_line_index += 1;

	//parse file layour header
	let elements: Array<Element> = [];
	while (ply_lines[current_line_index] !== "end_header")
	{
		const current_line = ply_lines[current_line_index];
		if (!current_line.startsWith("comment "))
		{
			if (current_line.startsWith("element "))
			{
				const line_contents = current_line.split(" ");
				elements.push(new Element(line_contents[1], parseInt(line_contents[2])));
			}
			else if (current_line.startsWith("property "))
			{
				if (elements.length == 0)
				{
					throw new Error("Property declaration cannot appear before first element declaration");
				}
				else
				{
					const element = elements[elements.length - 1];

					let line_contents = current_line.split(" ");
					if (line_contents[1] === "list")
					{
						element.properties.push(new Property(line_contents[4], PlyType.ListInt)); //doesn't support lists of floats
					}
					else if (line_contents[1] === "float")
					{
						element.properties.push(new Property(line_contents[2], PlyType.Float));
					}
					else
					{
						throw new Error("Unsupported property type");
					}
				}
			}
			else
			{
				throw new Error("Unrecognised leading keyword in header");
			}
		}

		current_line_index += 1;
	}

	current_line_index += 1;

	let loaded_elements: Map<string, Array<Map<string, number | Array<number>>>> = new Map();
	for (const element of elements)
	{
		let loaded_element_instances: Array<Map<string, number | Array<number>>> = [];
		loaded_elements.set(element.name, loaded_element_instances);

		let end_index = current_line_index + element.num_occurrences;
		for (; current_line_index < end_index; current_line_index++)
		{
			const line = ply_lines[current_line_index];
			const split_line = line.split(" ");

			let this_instance: Map<string, number | Array<number>> = new Map();
			
			let num_index = 0;
			for (const property of element.properties)
			{
				if (property.type === PlyType.Float)
				{
					this_instance.set(property.name, parseFloat(split_line[num_index]));
					num_index += 1;
				}
				else if (property.type === PlyType.ListInt)
				{
					let num_values = parseInt(split_line[num_index]);
					num_index += 1;
					let values: Array<number> = [];
					for (let i = 0; i < num_values; i++)
					{
						values.push(parseFloat(split_line[num_index]));
						num_index += 1;
					}
					this_instance.set(property.name, values);
				}
			}

			if (num_index !== split_line.length)
			{
				throw Error("Too many values provided for element");
			}

			loaded_element_instances.push(this_instance);
		}
	}

	let vertices: Array<Vertex> = [];
	let normals: Array<vec3> = [];
	for (const vertex_data of loaded_elements.get("vertex"))
	{
		vertices.push(new Vertex(
			vec3.fromValues(vertex_data.get("x") as number, vertex_data.get("y") as number, vertex_data.get("z") as number),
			vec2.fromValues(vertex_data.get("s") as number, vertex_data.get("t") as number))
		);
		normals.push(vec3.fromValues(vertex_data.get("nx") as number, vertex_data.get("ny") as number, vertex_data.get("nz") as number));
	}

	for (const face_data of loaded_elements.get("face"))
	{
		let vertex_indices: Array<number> = face_data.get("vertex_indices") as Array<number>;

		let sum_vec = vec3.fromValues(0, 0, 0);
		for (const vertex_index of vertex_indices)
		{
			vec3.add(sum_vec, sum_vec, normals[vertex_index]);
		}

		let normal = vec3.fromValues(0, 0, 0);
		vec3.normalize(normal, sum_vec);

		model.faces.push(new Face(normal, vertex_indices.map(index => vertices[index])));
	}

	return model;
}

async function loadPLYModelFromURL(model: Model, url: string)
{
	let ply_request = await fetch(url);
	let ply_contents = await ply_request.text();
	return loadPLYModel(model, ply_contents);
}

export {loadPLYModel as default, loadPLYModelFromURL};