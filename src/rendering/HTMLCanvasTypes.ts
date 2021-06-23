function isCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): canvas is HTMLCanvasElement
{
	return canvas instanceof HTMLCanvasElement;
};

function narrowCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): HTMLCanvasElement
{
	if (isCanvas(canvas))
	{
		return canvas;
	}
	else
	{
		throw new TypeError("\'canvas\' was not an HTMLCanvasElement");
	}
}

export default narrowCanvas;