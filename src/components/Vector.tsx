import React from "react";
import styles from "./Vector.module.css";


interface IFieldStyle
{
	label: string;
	min: number;
	max: number;
	step: number;
}

interface IProps
{
	styles: Array<IFieldStyle>;
	values: Array<number>;
	onChange: (values: Array<number>) => void;
};

interface IState {};

class Vector extends React.Component<IProps, IState>
{
	constructor(props: IProps)
	{
		super(props);

		if (props.styles === undefined)
		{
			throw Error("'styles' property is required");
		}

		if (props.values === undefined)
		{
			throw Error("'values' property is required");
		}

		if (this.props.styles.length !== this.props.values.length)
		{
			throw Error("The number of styles and values provided must be the same");
		}

		this.state = {};
	}

	render()
	{
		let fields = [];
		for (let i = 0; i < this.getNumValues(); i++)
		{
			const style = this.props.styles[i];
			fields.push(<>
				<div className={styles.FieldLabel}>{style.label}</div>
				<input className={styles.Field} type="range" min={style.min} max={style.max} step={style.step} value={this.props.values[i]} onChange={this.valueChanged.bind(this, i)} />
			</>);
		}

		return <div>{fields}</div>;
	}

	getNumValues()
	{
		return this.props.values.length;
	}

	valueChanged(index: number, event: React.ChangeEvent<HTMLInputElement>)
	{
		event.stopPropagation();

		let values = this.props.values;
		values[index] = parseFloat(event.target.value);
		
		if (this.props.onChange !== undefined)
		{
			this.props.onChange(values);
		}
	}
}

export default Vector;