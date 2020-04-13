export function dateSorter(
	a: Date | null | undefined,
	b: Date | null | undefined,
	inverse?: true
): number {
	let result = 0;
	if (!a) result = -1;
	else if (!b) result = 1;
	else if (a < b) result = -1;
	else if (a > b) result = 1;
	if (inverse) {
		result = -1 * result;
	}
	return result;
}
