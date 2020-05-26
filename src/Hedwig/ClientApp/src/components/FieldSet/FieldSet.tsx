import React from 'react';
import { FormStatus, FormStatusProps } from '..';
import cx from 'classnames';

export type FieldSetProps = {
	legend: string;
	id: string;
	showLegend?: boolean;
	status?: FormStatusProps;
	optional?: boolean;
	className?: string;
	hint?: string;
	horizontal?: boolean;
	childrenGroupClassName?: string;
	disabled?: boolean;
};

export const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	status,
	optional,
	className,
	children,
	hint,
	horizontal = false,
	childrenGroupClassName,
	disabled,
}) => {
	const hintId = `${id}-hint`;
	let ariaDescriber;
	if (hint) {
		ariaDescriber = hintId;
	}
	if (status) {
		ariaDescriber = status.id;
	}
	const fieldSetElement = (
		<fieldset
			className={cx(
				'grid-gap',
				'grid-row',
				'usa-fieldset',
				{
					[`usa-fieldset--${status && status.type}`]: status,
				},
				className
			)}
			id={id}
			aria-describedby={ariaDescriber}
			// TODO: is this bad usability? are things that aren't optional always required?
			aria-required={!optional}
			aria-invalid={status && status.type === 'error'}
			disabled={disabled}
		>
			<legend id={`fieldset-legend-${id}`}>
				{/* Needs to be wrapped in another el because spacing works differently for legends */}
				<span
					className={
						showLegend ? `usa-label${status ? ` usa-label--${status.type}` : ''}` : 'usa-sr-only'
					}
				>
					{legend}
					{optional && <span className="usa-hint">&nbsp;(optional)</span>}
				</span>
			</legend>
			{hint && <span className="usa-hint text-italic">{hint}</span>}
			{status && <FormStatus {...status} />}
			<div className={cx('grid-gap', 'grid-row', childrenGroupClassName)}>{children}</div>
		</fieldset>
	);
	return (
		<>
			{horizontal ? (
				<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
					{fieldSetElement}
				</div>
			) : (
				fieldSetElement
			)}
		</>
	);
};
