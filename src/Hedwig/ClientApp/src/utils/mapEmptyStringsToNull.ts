export default function mapEmptyStringsToNull(obj: any) {
	const result: any = {};

	for (const key in obj) {
		result[key] = obj[key] === '' ? null : obj[key];
	}

	return result;
}
