import Model, {Triangle, Vertex} from "./Model";

class GLModel extends Model
{
    _vao: WebGLVertexArrayObject;
	_vbo: WebGLBuffer;

	_context: WebGL2RenderingContext;

    constructor(context: WebGL2RenderingContext, triangles: Array<Triangle> = [])
    {
        super(undefined, undefined, undefined, triangles);

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

        this.pushVertices();
    };

    addTriangle(triangle: Triangle): void
	{
		super.addTriangle(triangle);
        this.pushVertices();
	}

    pushVertices(): void
    {
        const gl = this._context;

        let positions = this.toArray();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }

    bind(): void
    {
        const gl = this._context;

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bindVertexArray(this._vao);
    }
};

function GLModelFromModel(context: WebGL2RenderingContext, model: Model)
{
    return new GLModel(context, model.getTriangles());
}

export {GLModel as default, GLModelFromModel};