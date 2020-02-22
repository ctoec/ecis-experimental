import React, { ReactChild, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonAppearance = 'default' | 'base' | 'secondary' | 'unstyled' | 'outline';

type BaseButtonProps = {
	href?: string;
	appearance?: ButtonAppearance;
	disabled?: boolean;
	className?: string;
}

type ButtonProps = BaseButtonProps & {
	text: string | JSX.Element;
	onClick?: (() => any);
};

type SubmitButtonProps = BaseButtonProps & {
	text: string;
	onClick?: 'submit';
}

export function Button({
	text,
	onClick,
	href,
	appearance,
	disabled,
	className,
}: ButtonProps | SubmitButtonProps) {
	const isSubmit = onClick === 'submit';
	onClick = typeof onClick === 'function' ? onClick : () => {};

	const classString =
		'usa-button' +
		(appearance && appearance !== 'default' ? ' usa-button--' + appearance : '') +
		(className ? ' ' + className : '');

	if (href) {
		return (
			<Link to={href} className={classString} onClick={onClick}>
				{text}
			</Link>
		);
	}

	if (isSubmit) {
		return (
			<input
				className={classString}
				disabled={disabled}
				type="submit"
				value={typeof text === 'string' ? text : undefined}
				// This will never actually be an element but TS doesn't know that
			/>
		);
	}

	return (
		<button className={classString} disabled={disabled} onClick={onClick} type="button">
			{text}
		</button>
	);
}
