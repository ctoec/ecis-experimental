import React from 'react';
import { Link } from 'react-router-dom';

type ButtonAppearance = 'default' | 'base' | 'secondary' | 'unstyled' | 'outline';

type ButtonProps = {
	text: string;
	onClick?: () => any;
	href?: string;
	appearance?: ButtonAppearance;
	disabled?: boolean;
	className?: string,
};

export function Button({
	text,
	onClick,
	href,
	appearance,
	disabled,
	className,
}: ButtonProps) {
	onClick = onClick || (() => {});
	
	if (href) {
		return (
			<Link
				to={href}
				className={`usa-button ${
					appearance && appearance !== 'default' ? 'usa-button--' + appearance : ''
				}
				${className}
				`}
				onClick={onClick}
			>
				{text}
			</Link>
		);
	}


	return (
		<button
			className={`usa-button ${
				appearance && appearance !== 'default' ? 'usa-button--' + appearance : ''
			}`}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			{text}
		</button>
	);
}
