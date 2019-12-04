import React from 'react';
import { Link } from 'react-router-dom';

type ButtonAppearance = 'default' | 'base' | 'secondary' | 'unstyled';

type ButtonProps = {
	text: string;
	onClick?: () => any;
	href?: string;
	appearance?: ButtonAppearance;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset' | undefined;
};

export default function Button({
	text,
	onClick,
	href,
	appearance,
	disabled,
	type = 'button',
}: ButtonProps) {
	if (href) {
		return (
			<Link
				to={href}
				className={`usa-button ${
					appearance && appearance !== 'default' ? 'usa-button--' + appearance : ''
				}`}
			>
				{text}
			</Link>
		);
	}

	onClick = onClick || (() => {});

	return (
		<button
			className={`usa-button ${
				appearance && appearance !== 'default' ? 'usa-button--' + appearance : ''
			}`}
			disabled={disabled}
			onClick={onClick}
			type={type}
		>
			{text}
		</button>
	);
}
