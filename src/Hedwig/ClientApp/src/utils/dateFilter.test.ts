import { afterDate, beforeDate, betweenDates } from './dateFilter';

it.each([
	[[], new Date('01/01/2000'), []],
	[[new Date('01/01/2000')], new Date('01/01/2000'), []],
	[[new Date('01/01/2000')], new Date('01/01/2001'), []],
	[[new Date('01/01/2002')], new Date('01/01/2001'), [new Date('01/01/2002')]],
	[
		[new Date('01/01/2002'), new Date('01/01/2001')],
		new Date('01/01/2001'),
		[new Date('01/01/2002')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2000')],
		new Date('01/01/2001'),
		[new Date('01/01/2002')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2001')],
		new Date('01/01/2000'),
		[new Date('01/01/2002'), new Date('01/01/2001')],
	],
])('afterDate returns correct response', (dates, date, result) => {
	expect(afterDate(dates, date)).toEqual(result);
});

it.each([
	[[], new Date('01/01/2000'), []],
	[[new Date('01/01/2000')], new Date('01/01/2000'), []],
	[[new Date('01/01/2000')], new Date('01/01/1999'), []],
	[[new Date('01/01/2002')], new Date('01/01/2003'), [new Date('01/01/2002')]],
	[
		[new Date('01/01/2002'), new Date('01/01/2001')],
		new Date('01/01/2002'),
		[new Date('01/01/2001')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2000')],
		new Date('01/01/2001'),
		[new Date('01/01/2000')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2001')],
		new Date('01/01/2003'),
		[new Date('01/01/2002'), new Date('01/01/2001')],
	],
])('afterDate returns correct response', (dates, date, result) => {
	expect(beforeDate(dates, date)).toEqual(result);
});

it.each([
	[[], new Date('01/01/2000'), new Date('01/01/2001'), []],
	[[new Date('01/01/2000')], new Date('01/01/2000'), new Date('01/01/2000'), []],
	[[new Date('01/01/2000')], new Date('01/01/1999'), new Date('01/01/2000'), []],
	[
		[new Date('01/01/2002')],
		new Date('01/01/2001'),
		new Date('01/01/2003'),
		[new Date('01/01/2002')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2001')],
		new Date('01/01/2001'),
		new Date('01/01/2003'),
		[new Date('01/01/2002')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2000')],
		new Date('01/01/1999'),
		new Date('01/01/2001'),
		[new Date('01/01/2000')],
	],
	[
		[new Date('01/01/2002'), new Date('01/01/2001')],
		new Date('01/01/2000'),
		new Date('01/01/2003'),
		[new Date('01/01/2002'), new Date('01/01/2001')],
	],
])('afterDate returns correct response', (dates, startDate, endDate, result) => {
	expect(betweenDates(dates, startDate, endDate)).toEqual(result);
});
