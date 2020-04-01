import React from 'react';
import { FormContext, FormContextType, GenericFormContextType } from './Form';
import useContext from '../../utils/useContext';

type FormFieldComponentProps<TData, TFieldData> = {
	onChange: any;
	data: TFieldData;
	containingData: TData;
	name: string;
};

type Value<T> = Exclude<T, null | undefined>;

function isValue<T>(_: T): _ is Value<T> {
	return _ !== null && _ !== undefined;
}

type FormFieldProps<TData, TProps extends React.Props<any>, TFieldData, TAdditionalData> = {
	render: (
		_: FormFieldComponentProps<TData, TFieldData> & {
			additionalInformation: TAdditionalData;
		}
	) => React.ReactElement<TProps>;
	parseValue: (_: any, __: any) => TFieldData;
	field: (_: Updatable<Value<TData>>) => Updatable<Value<TFieldData>>;
};

class Updatable<T> {
	data: T;
	path: string;

	constructor(obj: T, path?: string) {
		this.data = obj;
		this.path = path || '';
	}

	at<K extends keyof T>(field: K): Updatable<Value<T[K]>> {
		if (!isValue(this.data)) {
			if (typeof field === 'number') {
				this.data = ([] as unknown) as T;
			} else {
				this.data = ({ [field]: undefined } as unknown) as T;
			}
		}
		const newPath = this.path === '' ? '' + field : `${this.path}.${field}`;
		let subObj = this.data[field];

		return new Updatable((subObj as unknown) as Value<T[K]>, newPath);
	}
}

function update<T>(data: Value<T>): Updatable<T> {
	return new Updatable(data);
}

function FormField<TData, TProps, TFieldData, TAdditionalData>({
	render,
	parseValue,
	field,
}: FormFieldProps<TData, TProps, TFieldData, TAdditionalData>) {
	const { data, updateData, additionalInformation } = useContext<
		GenericFormContextType<TAdditionalData>
	>(FormContext);
	const { data: currentPathData, path } = field(update(data));

	const renderProps = {
		onChange: updateData(parseValue),
		data: currentPathData,
		containingData: data,
		name: path,
		additionalInformation,
	};

	return render(renderProps);
}

export default FormField;
