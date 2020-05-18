import cloneDeep from 'lodash/cloneDeep';

/**
 * A type-safe way to drill down into an object and gather the associated path
 */
export class ObjectDriller<T> {
	value: T;
	path: string;

	constructor(obj: T, path?: string) {
		this.value = cloneDeep(obj);
		this.path = path || '';
	}

	/**
	 * Drill down into the object by specifying the next field
	 * @param field A field on the data object
	 */
	at<K extends keyof T>(field: K): ObjectDriller<NonNullable<T[K]>> {
		if (this.value == undefined) {
			// checks null or undefined
			if (typeof field === 'number') {
				this.value = ([] as unknown) as T;
			} else {
				this.value = ({ [field]: undefined } as unknown) as T;
			}
		}
		const newPath = this.path === '' ? '' + field : `${this.path}.${field}`;
		let subObj = this.value[field];

		return new ObjectDriller((subObj as unknown) as NonNullable<T[K]>, newPath);
	}

	// todo ensure T is array
	find<S extends any[], K extends keyof S>(
		func: (_: S[number]) => boolean
	): ObjectDriller<NonNullable<S[K]>> {
		// Instantiate the array if it does not exist
		if (this.value == undefined) {
			// checks null or undefined
			this.value = ([] as unknown) as T;
		}

		// because this.value is type T  we still need this check (only type S is known array)
		if (Array.isArray(this.value)) {
			let idx = this.value.findIndex(func);
			// Add new element to end of array if item does not exist
			idx = idx < 0 ? this.value.length : idx;

			const newPath = this.path === '' ? '' + idx : `${this.path}.${idx}`;
			const subObj = this.value[idx];

			return new ObjectDriller((subObj as unknown) as NonNullable<S[K]>, newPath);
		}

		throw new Error('find can only be called on array properties');
	}
}
