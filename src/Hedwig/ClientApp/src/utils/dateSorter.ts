export function dateSorter(a: Date | null | undefined, b: Date | null | undefined): number {
	if (!a) return -1;
	if (!b) return 1;
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

export function inverseDateSorter(a: Date | null | undefined, b: Date | null | undefined): number {
	return dateSorter(a, b) * -1;
}
