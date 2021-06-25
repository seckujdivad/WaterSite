import React, {RefObject} from "react";

import styles from "./SceneLayer.module.css";


interface IProps {
	transparency: number,
	colour: string,
	row: number,
	numRows: number,
	onTransparencyChange: (newTransparency: number) => any,
	onColourChange: (newColour: string) => any,
	onMovePressed: (moveUp: boolean) => any
};

interface IState {};

class SceneLayer extends React.Component<IProps, IState>
{
	constructor(props)
	{
		super(props);
	};

	render()
	{
		let transparency = 0;
		if (this.props.transparency !== undefined)
		{
			transparency = this.props.transparency;
		}

		let colour = "#FFFFFF";
		if (this.props.colour !== undefined)
		{
			colour = this.props.colour;
		}

		let row_index = 0;
		if (this.props.row === undefined)
		{
			throw new Error("Property 'row' must be defined");
		}
		else
		{
			row_index = this.props.row;
		}

		let num_rows = 0;
		if (this.props.numRows === undefined)
		{
			throw new Error("Property 'numRows' must be defined");
		}
		else
		{
			num_rows = this.props.numRows;
		}

		return <div className={styles.SceneLayer}>
				<div className={styles.Label}>Transparent</div>
				<input className={styles.Item} type="range" min="0" max="1" step="0.001" value={transparency} onChange={this.onTransparencyChange.bind(this)} />
				<div className={styles.Label}>Opaque</div>
				<div className={styles.Label}>Colour</div>
				<input className={styles.Item} type="color" value={colour} onChange={this.onColourChange.bind(this)} />
				<button className={styles.MoveButton} disabled={row_index <= 0} onClick={this.onMovePressed.bind(this, true)}>˄</button>
				<button className={styles.MoveButton} disabled={row_index >= (num_rows - 1)} onClick={this.onMovePressed.bind(this, false)}>˅</button>
			</div>;
	};

	onTransparencyChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		event.stopPropagation();

		if (this.props.onTransparencyChange !== undefined)
		{
			this.props.onTransparencyChange(parseFloat(event.target.value));
		}
	}

	onColourChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		event.stopPropagation();

		if (this.props.onColourChange !== undefined)
		{
			this.props.onColourChange(event.target.value);
		}
	}

	onMovePressed(up: boolean, event: React.MouseEvent<HTMLInputElement>)
	{
		event.stopPropagation();

		if (this.props.onMovePressed !== undefined)
		{
			this.props.onMovePressed(up);
		}
	}
};


export default SceneLayer;