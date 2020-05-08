import React from 'react';
import { storiesOf } from '@storybook/react';

import { SideNav } from '..';

storiesOf('SideNav', module).add('Success', () => {
	return <SideNav type={'success'} heading="Success alert!" text="Good job, you." />;
});