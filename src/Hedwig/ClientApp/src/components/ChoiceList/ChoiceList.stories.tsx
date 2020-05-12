import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ChoiceList, FormStatusProps, ChoiceListExpansion } from '..';
import { TextInput } from '../TextInput/TextInput';

const onChange = action('onChange');
const options = [
	{
		text: 'Option one',
		value: 'one',
	},
	{
		text: 'Option two',
		value: 'two',
	},
];
const warning: FormStatusProps = {
	type: 'warning',
	message: 'These fields need your attention',
	id: 'checklist-warning',
};
const error: FormStatusProps = {
	type: 'error',
	message: 'These fields will block your progress',
	id: 'checklis-error',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'These fields were validated woo',
	id: 'checklist-success',
};

storiesOf('ChoiceList', module)
	.add('Radio', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			/>
		);
	})
	.add('Radio with preselected option', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
				defaultValue={['one']}
			/>
		);
	})
	.add('Radio with error', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
				status={error}
			/>
		);
	})
	.add('Disabled radio', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				disabled={true}
				id="storybook-radio"
				legend="Radio items"
			/>
		);
	})
	.add('Radio with one single element expansion', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Radio with one multi element expansion', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Radio with both single element expansion', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
				</ChoiceListExpansion>
				<ChoiceListExpansion showOnValue={'two'}>
					<p>No, thank YOU for selecting option two!</p>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Radio with one single element expansion with warning', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
						status={warning}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Radio with one single element expansion with error', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
						status={error}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Radio with one multi element expansion with warning', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
						status={warning}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Radio with one multi element expansion with error', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
						status={error}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Checklist', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
			/>
		);
	})
	.add('Single checkbox', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={[options[0]]}
				id="storybook-checklist"
				legend="Checklist items"
			/>
		);
	})
	.add('Checklist with warning', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				status={warning}
			/>
		);
	})
	.add('Disabled checklist', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				disabled={true}
				id="storybook-checklist"
				legend="Checklist items"
			/>
		);
	})
	.add('CheckList with one single element expansion', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Checklist items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('CheckList with one multi element expansion', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Checklist items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('CheckList with both single element expansion', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Checklist items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
				</ChoiceListExpansion>
				<ChoiceListExpansion showOnValue={'two'}>
					<p>Option two. Nice!</p>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Select', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-select"
			/>
		);
	})
	.add('Select with success', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				status={success}
			/>
		);
	})
	.add('Select with other', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				otherInputLabel="Other choice"
			/>
		);
	})
	.add('Disabled select', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				disabled={true}
				id="storybook-select"
			/>
		);
	})
	.add('Select with one single element expansion', () => {
		return (
			<ChoiceList
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				label="Checklist items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Select with one multi element expansion', () => {
		return (
			<ChoiceList
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				label="Checklist items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
					<TextInput
						id="radio-multi-text-input"
						label="Interactive Element?"
						defaultValue="Yes, you can!"
						onChange={onChange}
					/>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	})
	.add('Select with both single element expansion', () => {
		return (
			<ChoiceList
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				label="Checklist items"
			>
				<ChoiceListExpansion showOnValue={'one'}>
					<p>Thank you for selecting option one!</p>
				</ChoiceListExpansion>
				<ChoiceListExpansion showOnValue={'two'}>
					<p>What's up, two selector! You cool!</p>
				</ChoiceListExpansion>
			</ChoiceList>
		);
	});
