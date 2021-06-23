import {vec3, vec2} from "gl-matrix";
import Model, {Triangle, Vertex} from "./Model";

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
	num_occurences: number;
	properties: Array<Property>;

	constructor(name: string, num_occurrences: number, properties: Array<Property> = [])
	{
		this.name = name;
		this.num_occurences = num_occurrences;
		this.properties = properties;
	}
}

function loadModelFromPLY(ply_contents: string): Model //this function is only written to work with Blender's PLY ouptut
{
	let model = new Model();

	let ply_lines = ply_contents.split("\n");
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
		let current_line = ply_lines[current_line_index];
		if (!current_line.startsWith("comment "))
		{
			if (current_line.startsWith("element "))
			{
				let line_contents = current_line.split(" ");
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
					let element = elements[elements.length - 1];

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

	return model;
};

export default loadModelFromPLY;