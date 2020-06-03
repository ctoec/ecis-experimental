import React from 'react';
import { TabNav } from '../../components/TabNav/TabNav';

export const Test = () => {
	return (
		<>
			<TabNav
				items={[
					{
						text: <span>Tab 1</span>,
						content: <p>Hi</p>,
					},
					{
						text: 'Tab 2',
						content: <p>Who</p>,
					},
				]}
			/>
		</>
	);
};
