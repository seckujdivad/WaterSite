import React from "react";

import styles from "./SceneLayer.module.css";


class SceneLayer extends React.Component
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

		return <div className={styles.SceneLayer}>
				<div className={styles.Label}>Transparent</div>
				<input className={styles.Item} type="range" min="0" max="1" step="0.001" value={transparency} onChange={this.onTransparencyChange.bind(this)}></input>
				<div className={styles.Label}>Opaque</div>
				<div className={styles.Label}>Colour</div>
				<input className={styles.Item} type="color" value={colour} onChange={this.onColourChange.bind(this)}></input>
				<button className={styles.MoveButton} onChange={this.onMovePressed.bind(this, true)}>˄</button>
				<button className={styles.MoveButton} onChange={this.onMovePressed.bind(this, false)}>˅</button>
			</div>;
	};

	onTransparencyChange(event)
	{
		event.stopPropagation();

		if (this.props.onTransparencyChange !== undefined)
		{
			this.props.onTransparencyChange(parseFloat(event.target.value));
		}
	}

	onColourChange(event)
	{
		event.stopPropagation();

		if (this.props.onColourChange !== undefined)
		{
			this.props.onColourChange(event.target.value);
		}
	}

	onMovePressed(up, event)
	{

	}
};


export default SceneLayer;