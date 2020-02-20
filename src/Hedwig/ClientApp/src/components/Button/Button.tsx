import React from 'react';
import { Link } from 'react-router-dom';

type ButtonAppearance = 'default' | 'base' | 'secondary' | 'unstyled' | 'outline';

type ButtonProps = {
	text: string;
	onClick?: (() => any) | 'submit';
	href?: string;
	appearance?: ButtonAppearance;
	disabled?: boolean;
	className?: string;
};

export function Button({ text, onClick, href, appearance, disabled, className }: ButtonProps) {
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
		return <input className={classString} disabled={disabled} type="submit" value={text} />;
	}

	return (
		<button className={classString} disabled={disabled} onClick={onClick} type="button">
			{text}
		</button>
	);
}
