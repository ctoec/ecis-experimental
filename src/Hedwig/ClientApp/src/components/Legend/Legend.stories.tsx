import React from 'react';
import { storiesOf } from '@storybook/react';
import { Legend } from '..';

const legendItems = [
	{
		text: 'One fish',
	},
	{
		text: 'Two fish',
	},
	{
		text: 'Red fish',
		symbolClass: 'text-red',
	},
	{
		text: 'Blue fish',
		symbolClass: 'text-blue',
	},
];

storiesOf('Legend', module).add('Default', () => {
	return <Legend items={legendItems} />;
});
