import React, { useContext } from 'react';
import FormContext from './FormContext';
import produce from 'immer';
import set from 'lodash/set';

type FormFieldPropsSimpleUpdate<TData, TFieldData, TComponentProps> = {
	type: 'simple';
	// Maybe revisit return type
	getValue: (_: PathAccessor<TData>) => PathAccessor<TFieldData>;
};

type FormFieldPropsComplexUpdate<TData, TFieldData, TUpdateData, TComponentProps> = {
	type: 'complex';
	// Maybe revisit return type
	getValueForDisplay: (_: PathAccessor<TData>) => PathAccessor<TFieldData>;
	getValueForUpdate: (_: PathAccessor<TData>) => PathAccessor<TUpdateData>;
};

type FormFieldProps<TData, TComponentProps, TFieldData, TUpdateData = never> = 
	(FormFieldPropsSimpleUpdate<TData, TFieldData, TComponentProps> | FormFieldPropsComplexUpdate<TData, TFieldData, TUpdateData, TComponentProps>)
	& {
		defaultValue?: TFieldData;
		inputComponent: React.FC<TComponentProps>;
		preprocessForDisplay?: (_: TFieldData | undefined) => TFieldData | JSX.Element | string | undefined;
		preprocessForUpdate: (event: React.ChangeEvent<any>) => TFieldData;
	}
	// TODO: Make this props a first order citizen
	& {
		props: Pick<
			TComponentProps,
			Exclude<keyof TComponentProps, 'onChange' | 'defaultValue'>
		>
	};

/**
 * Helper utility to test whether a variable is of Value type
 * @param _ Any obj to test whether it satisfies Value type
 */
function isNonNullable<T>(_: T): _ is NonNullable<T> {
	return _ !== null && _ !== undefined;
}

/**
 * A type-safe way to drill down into an object and gather the associated path
 */
class PathAccessor<T> {
	value: T;
	path: string;

	constructor(obj: T, path?: string) {
		this.value = obj;
		this.path = path || '';
	}

	/**
	 * Drill down into the object by specifying the next field
	 * @param field A field on the data object
	 */
	at<K extends keyof T>(field: K): PathAccessor<
		NonNullable<T[K]>
	> {
		if (!isNonNullable(this.value)) {
			if (typeof field === 'number') {
				this.value = ([] as unknown) as T;
			} else {
				this.value = ({ [field]: undefined } as unknown) as T;
			}
		}
		const newPath = this.path === '' ? '' + field : `${this.path}.${field}`;
		let subObj = this.value[field];

		return new PathAccessor((subObj as unknown) as NonNullable<T[K]>, newPath);
	}

	// todo ensure T is array
	find<S extends any[], K extends keyof S>(func: (_:S[number]) => boolean): PathAccessor<NonNullable<S[K]>>
	{
		// Instantiate the array if it does not exist
		if(isNonNullable(this.value)) {
			this.value = ([] as unknown) as T;
		}

		// because this.value is type T  we still need this check (only type S is known array)
		if(Array.isArray(this.value)) {
			let idx = this.value.findIndex(func);
			// Add new element to end of array if item does not exist
			idx = idx < 0 ? this.value.length : idx;

			const newPath = this.path === '' ? '' + idx : `${this.path}.${idx}`;
			let subObj = this.value[idx];
	
			return new PathAccessor((subObj as unknown) as NonNullable<S[K]>, newPath);
		}

		throw new Error("HOW DAREYOU!");
	}
}

const FormField = <TData extends object, TComponentProps, TFieldData, TUpdateData = never>({
	defaultValue,
	preprocessForDisplay,
	preprocessForUpdate,
	inputComponent: InputComponent,
	props,
	..._
}: FormFieldProps<TData, TComponentProps, TFieldData, TUpdateData>) => {
	const { data, updateData } = useContext(FormContext);

	let getValueForDisplay;
	let getValueForUpdate;
	switch (_.type) {
		case 'complex':
			getValueForDisplay = _.getValueForDisplay;
			getValueForUpdate = _.getValueForUpdate;
			break;
		case 'simple':
		default:
			getValueForDisplay = _.getValue;
			getValueForUpdate = _.getValue;
			break;
	}

	const somethingData = new PathAccessor(data);
	const displayValue = getValueForDisplay(somethingData).value;
	const updatePath = getValueForUpdate(somethingData).path;

	const onChange = (e: React.ChangeEvent<any>) => {
		const processedData = preprocessForUpdate(e);
		updateData(produce<TData>(
			data, draft => set(draft, updatePath, processedData)
		));
	};

	return (
		// @ts-ignore
		<InputComponent
			defaultValue={
				preprocessForDisplay ? preprocessForDisplay(displayValue || defaultValue) : (displayValue || defaultValue)
			}
			onChange={onChange}
			{...props}
		/>
	);
}

export default FormField;
