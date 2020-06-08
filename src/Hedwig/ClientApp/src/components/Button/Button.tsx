import React from 'react';
import { Link } from 'react-router-dom';

type ButtonAppearance = 'default' | 'base' | 'secondary' | 'unstyled' | 'outline';

type BaseButtonProps = {
	href?: string;
	external?: boolean;
	appearance?: ButtonAppearance;
	disabled?: boolean;
	className?: string;
};

export type ButtonProps = BaseButtonProps &
	React.HTMLProps<HTMLButtonElement | HTMLAnchorElement> & {
		text: string | JSX.Element;
		onClick?: () => any;
	};

type SubmitButtonProps = BaseButtonProps & {
	text: string;
	onClick?: 'submit';
	title?: string;
};

export function Button({
	text,
	onClick,
	href,
	external,
	appearance,
	disabled,
	className,
	title,
}: ButtonProps | SubmitButtonProps) {
	const classString =
		'usa-button' +
		(appearance && appearance !== 'default' ? ' usa-button--' + appearance : '') +
		(className ? ' ' + className : '');

	if (onClick === 'submit') {
		return (
			<input
				className={classString}
				disabled={disabled}
				type="submit"
				value={text as string}
				// Value will never actually be an element for a submit button but TS doesn't know that
				title={title}
			/>
		);
	}
	onClick = typeof onClick === 'function' ? onClick : () => {};

	if (href && !external) {
		return (
			<Link to={href} className={classString} onClick={onClick} title={title}>
				{text}
			</Link>
		);
	}

	if (href && external) {
		return (
			<a href={href} className={classString} onClick={onClick} title={title}>
				{text}
			</a>
		);
	}

	return (
		<button
			className={classString}
			disabled={disabled}
			onClick={onClick}
			type="button"
			title={title}
		>
			{text}
		</button>
	);
}
