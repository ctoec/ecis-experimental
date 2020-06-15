import React from 'react';
import { FormStatus, FormStatusProps } from '..';
import cx from 'classnames';

export type FieldSetProps = {
	legend: string;
	id: string;
	showLegend?: boolean;
	legendStyle?: 'normal' | 'title';
	status?: FormStatusProps;
	optional?: boolean;
	className?: string;
	hint?: string;
	horizontal?: boolean;
	childrenGroupClassName?: string;
	disabled?: boolean;
};

/**
 * Accessibility-following wrapping component for a native fieldset element
 */
export const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	legendStyle = 'normal',
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

	return (
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
					className={cx({
						'usa-label': showLegend,
						'usa-sr-only': !showLegend,
						[`usa-label--${status && status.type}`]: showLegend && status,
						'text-bold font-sans-lg': showLegend && legendStyle === 'title',
					})}
				>
					{legend}
					{optional && <span className="usa-hint">&nbsp;(optional)</span>}
				</span>
			</legend>
			{hint && <span className="usa-hint text-italic">{hint}</span>}
			{status && <FormStatus {...status} />}
			<div
				className={cx(
					'grid-gap',
					childrenGroupClassName,
					{ 'grid-row flex-align-start': !horizontal },
					{ 'grid-col': horizontal }
				)}
			>
				{children}
			</div>
		</fieldset>
	);
};
