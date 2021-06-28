import React from "react";

import styles from "./Vector.module.css";


interface IFieldStyle
{
	label?: string;
	min?: number;
	max?: number;
	step?: number;
}

interface IProps
{
	className?: string;
	styles: Array<IFieldStyle>;
	defaultStyle?: IFieldStyle;
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
			if (this.props.defaultStyle !== undefined)
			{
				if (style.label === undefined)
				{
					style.label = this.props.defaultStyle.label;
				}

				if (style.min === undefined)
				{
					style.min = this.props.defaultStyle.min;
				}

				if (style.max === undefined)
				{
					style.max = this.props.defaultStyle.max;
				}

				if (style.step === undefined)
				{
					style.step = this.props.defaultStyle.step;
				}
			}

			if (style.label === undefined)
			{
				throw new Error("'label' must be defined in at least one of defaultStyle or every per-axis style");
			}

			if (style.min === undefined)
			{
				throw new Error("'min' must be defined in at least one of defaultStyle or every per-axis style");
			}

			if (style.max === undefined)
			{
				throw new Error("'max' must be defined in at least one of defaultStyle or every per-axis style");
			}

			if (style.step === undefined)
			{
				throw new Error("'step' must be defined in at least one of defaultStyle or every per-axis style");
			}

			fields.push(
				<div key={i} className={styles.VectorElement}>
					<div className={styles.FieldLabel}>{style.label}</div>
					<input className={styles.Field} type="range" min={style.min} max={style.max} step={style.step} value={this.props.values[i]} onChange={this.valueChanged.bind(this, i)} />
				</div>
			);
		}

		let class_name = styles.Vector;
		if (this.props.className !== undefined)
		{
			class_name = this.props.className + " " + class_name;
		}

		return <div className={class_name}>{fields}</div>;
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