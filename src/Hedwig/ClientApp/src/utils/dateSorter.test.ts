import { dateSorter } from './dateSorter';

it.each([
	[undefined, undefined, false, 0],
	[undefined, undefined, true, 0],
	[undefined, null, false, 0],
	[undefined, null, true, 0],
	[null, undefined, false, 0],
	[null, undefined, true, 0],
	[null, null, false, 0],
	[null, null, true, 0],
	[new Date('01/01/2000'), undefined, false, -1],
	[new Date('01/01/2000'), undefined, true, 1],
	[undefined, new Date('01/01/2001'), false, 1],
	[undefined, new Date('01/01/2001'), true, -1],
	[new Date('01/01/2000'), null, false, -1],
	[new Date('01/01/2000'), null, true, 1],
	[null, new Date('01/01/2001'), false, 1],
	[null, new Date('01/01/2001'), true, -1],
	[new Date('01/01/2001'), new Date('01/01/2001'), false, 0],
	[new Date('01/01/2001'), new Date('01/01/2001'), true, 0],
	[new Date('01/01/2002'), new Date('01/01/2001'), false, 1],
	[new Date('01/01/2002'), new Date('01/01/2001'), true, -1],
	[new Date('01/01/2002'), new Date('01/01/2003'), false, -1],
	[new Date('01/01/2002'), new Date('01/01/2003'), true, 1],
])('date sorter sorts correctly', (a, b, inverse, result) => {
	if (result === 0) {
		expect(dateSorter(a, b, inverse ? true : undefined)).toBe(0);
	} else if (result > 0) {
		expect(dateSorter(a, b, inverse ? true : undefined)).toBeGreaterThanOrEqual(result);
	} else {
		expect(dateSorter(a, b, inverse ? true : undefined)).toBeLessThanOrEqual(result);
	}
});
