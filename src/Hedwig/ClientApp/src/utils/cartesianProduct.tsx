// Cross multiplies arrays
// If given { a: [1, 2], b: [3, 4] }
// will return [{ a: 1, b: 3 }, { a: 1, b: 4 }, { a: 2, b: 3 }, { a: 2, b: 4 }]

export default function cartesianProduct<T extends { [key: string]: any }>(
	sets: { [P in keyof T]: T[P][]; }
): T[] {
	return Object.keys(sets).reduce<Partial<T>[]>((acc, key) => {
		return acc.flatMap(obj => sets[key].map((value) => {
			return { ...obj, [key]: value};
		}));
	}, [{}]) as T[];
}
