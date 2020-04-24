export default function notNullOrUndefined<T>(value: T): value is Exclude<T, undefined | null> {
	return value !== null && typeof value !== 'undefined';
}
