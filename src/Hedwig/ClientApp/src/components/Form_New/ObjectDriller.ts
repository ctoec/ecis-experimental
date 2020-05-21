type TObjectDrillerInternal<T> = {
	value: T;
	path: string;
	at<K extends keyof T>(field: K): TObjectDriller<NonNullable<T[K]>>;
};

export type TObjectDriller<T> = (T extends (infer R)[]
	? {
			find(func: (_: R) => boolean): TObjectDriller<NonNullable<R>>;
	  }
	: {}) &
	TObjectDrillerInternal<T>;

/**
 * A type-safe way to drill down into an object and gather the associated path
 * NOTE: ObjectDriller is only for accessing data. The underlying `obj` should
 * never be mutated directly.
 */
export class ObjectDriller<T> {
	value: T;
	arrayValue: any[];
	path: string;

	constructor(obj: T, path?: string) {
		this.value = obj;
		this.arrayValue = (this.value as unknown) as T[keyof T][];
		this.path = path || '';
	}

	/**
	 * Drill down into the object by specifying the next field
	 * @param field A field on the data object
	 */
	at<K extends keyof T>(field: K): TObjectDriller<NonNullable<T[K]>> {
		if (this.value == undefined) {
			// checks null or undefined
			if (typeof field === 'number') {
				this.value = ([] as unknown) as T;
			} else {
				this.value = ({ [field]: undefined } as unknown) as T;
			}
		}
		const subObj = this.value[field];
		const newPath = this.path === '' ? '' + field : `${this.path}.${field}`;

		return (new ObjectDriller(
			(subObj as unknown) as NonNullable<T[K]>,
			newPath
		) as unknown) as TObjectDriller<NonNullable<T[K]>>;
	}

	find<K extends keyof T>(func: (_: T[K]) => boolean): TObjectDriller<NonNullable<T[K]>> {
		// Instantiate the array if it does not exist
		if (this.arrayValue == undefined) {
			// checks null or undefined
			this.arrayValue = ([] as unknown) as T[K][];
		}

		let idx = this.arrayValue.findIndex(func);
		// Add new element to end of array if item does not exist
		idx = idx < 0 ? this.arrayValue.length : idx;

		const newPath = this.path === '' ? '' + idx : `${this.path}.${idx}`;
		const subObj = this.arrayValue[idx];

		return (new ObjectDriller(
			(subObj as unknown) as NonNullable<T[K]>,
			newPath
		) as unknown) as TObjectDriller<NonNullable<T[K]>>;
	}
}
