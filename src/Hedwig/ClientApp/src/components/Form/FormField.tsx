import React from 'react';
import { FormContext, GenericFormContextType } from './Form';
import useContext from '../../utils/useContext';

/**
 * Helper type to exclude null or undefined from the type
 */
type Value<T> = Exclude<T, null | undefined>;

/**
 * Helper utility to test whether a variable is of Value type
 * @param _ Any obj to test whether it satisfies Value type
 */
function isValue<T>(_: T): _ is Value<T> {
	return _ !== null && _ !== undefined;
}

/**
 * A type-safe way to drill down into an object and gather the associated path
 */
class Updateable<T> {
	data: T;
	path: string;

	constructor(obj: T, path?: string) {
		this.data = obj;
		this.path = path || '';
	}

	/**
	 * Drill down into the object by specifying the next field
	 * @param field A field on the data object
	 */
	at<K extends keyof T>(field: K): Updateable<Value<T[K]>> {
		if (!isValue(this.data)) {
			if (typeof field === 'number') {
				this.data = ([] as unknown) as T;
			} else {
				this.data = ({ [field]: undefined } as unknown) as T;
			}
		}
		const newPath = this.path === '' ? '' + field : `${this.path}.${field}`;
		let subObj = this.data[field];

		return new Updateable((subObj as unknown) as Value<T[K]>, newPath);
	}
}

/**
 * Wrapper to the Updateable constructor with type casting
 * @param data
 */
function makeUpdateableType<T>(data: Value<T>): Updateable<Value<T>> {
	return new Updateable(data);
}

/**
 * Type for the props of the rendered form field component
 */
type FormFieldComponentProps<TData, TFieldData> = {
	/**
	 * An internal controller to trigger the reducer on user changes
	 */
	onChange: any;
	// TO DELETE
	onChange_Old: any;
	/**
	 * The data of the specified field that is being displayed/edited
	 */
	data: TFieldData;
	/**
	 * The data of the object controlling the form
	 */
	containingData: TData;
	/**
	 * The path to the field data
	 */
	name: string;
};

/**
 * Type for the props supplied to the FormField component
 */
type FormFieldProps<TData, TProps extends React.Props<any>, TFieldData, TAdditionalData> = {
	render: (
		_: FormFieldComponentProps<TData, TFieldData> & {
			additionalInformation: TAdditionalData;
		}
	) => React.ReactElement<TProps>;
	/**
	 * Function for converting the HTML Event target value string
	 * into the data corresponding to the model
	 */
	parseValue: (_: any, __?: any) => TFieldData;
	/**
	 * Function for accessing a specific value in the supplied data
	 */
	field: (_: Updateable<Value<TData>>) => Updateable<Value<TFieldData>>;
};

/**
 * Component for rendering a form field
 * @param props
 */
function FormField<TData, TProps, TFieldData, TAdditionalData>({
	render,
	parseValue,
	field: getField,
}: FormFieldProps<TData, TProps, TFieldData, TAdditionalData>) {
	// Uses a non-React useContext hook to allow for generics in the supplied type
	const { data: parentObjectData, updateData, additionalInformation } = useContext<
		GenericFormContextType<Value<TData>, TFieldData, TAdditionalData>
	>(FormContext);
	// Prepare data as an Updateable and access the specified field and path
	const { data: fieldData, path: objectFieldAccessorPath } = getField(
		makeUpdateableType(parentObjectData)
	);

	const renderProps = {
		onChange: updateData(parseValue),
		onChange_Old: updateData(parseValue),
		data: fieldData,
		containingData: parentObjectData,
		name: objectFieldAccessorPath,
		additionalInformation,
	};

	return render(renderProps);
}

export default FormField;
