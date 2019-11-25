import React from 'react';
import { storiesOf } from '@storybook/react';

import Legend from './Legend';

const legendItems = [
	{
		text: 'One fish',
		number: 1,
	},
	{
		text: 'Two fish',
		number: 2,
	},
	{
		text: 'Red fish',
		symbolColor: 'red',
		number: 2,
	},
	{
		text: 'Blue fish',
		symbolColor: 'blue',
		number: 4,
	},
];

storiesOf('Legend', module)
	.add('Default', () => {
		return <Legend items={legendItems} />;
	});
