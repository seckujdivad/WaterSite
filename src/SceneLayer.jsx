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

		let colour = "#6060FF";
		if (this.props.colour !== undefined)
		{
			colour = this.props.colour;
		}

		return <div className={styles.SceneLayer}>
				<div className={styles.SceneLayerItem}>Transparent</div>
				<input className={styles.SceneLayerItem} type="range" min="0" max="1" step="0.001" value={transparency} onChange={this.onTransparencyChange.bind(this)}></input>
				<div className={styles.SceneLayerItem}>Opaque</div>
				<div className={styles.SceneLayerItem}>Colour</div>
				<input className={styles.SceneLayerItem} type="color" value={colour} onChange={this.onColourChange.bind(this)}></input>
			</div>;
	};

	onTransparencyChange(event)
	{
		if (this.props.onTransparencyChange !== undefined)
		{
			this.props.onTransparencyChange(parseFloat(event.target.value));
		}
	}

	onColourChange(event)
	{
		if (this.props.onColourChange !== undefined)
		{
			this.props.onColourChange(event.target.value);
		}
	}
};


export default SceneLayer;