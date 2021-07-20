function arraysAreEqual<T>(first: Array<T>, second: Array<T>): boolean
{
	if (first === undefined || second === undefined)
	{
		return false;
	}

	if (first.length !== second.length)
	{
		return false;
	}
	else
	{
		for (let i = 0; i < first.length; i++)
		{
			if (first[i] !== second[i])
			{
				return false;
			}
		}
		return true;
	}
}

class GLModel
{
	_vao: WebGLVertexArrayObject;
	_vbo: WebGLBuffer;

	_context: WebGL2RenderingContextStrict;

	_last_vertices: Array<number>;

	constructor(context: WebGL2RenderingContextStrict, vertices: Array<number> = [])
	{
		this._context = context;
		const gl = this._context;

		this._vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);

		this._vao = gl.createVertexArray();
		gl.bindVertexArray(this._vao);
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);
		gl.enableVertexAttribArray(3);

		const SIZEOF_FLOAT = 4;
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 0);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 3 * SIZEOF_FLOAT);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 5 * SIZEOF_FLOAT);
		gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 11 * SIZEOF_FLOAT, 8 * SIZEOF_FLOAT);

		this.setVertices(vertices);
	}

	setVertices(vertices: Array<number>): void
	{
		const gl = this._context;

		let positions = vertices;
		if (!arraysAreEqual(positions, this._last_vertices))
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
			this._last_vertices = positions;
		}
	}

	bind(): void
	{
		const gl = this._context;

		gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
		gl.bindVertexArray(this._vao);
	}
};

export {GLModel as default};