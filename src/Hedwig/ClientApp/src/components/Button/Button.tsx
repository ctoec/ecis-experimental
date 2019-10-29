import React from 'react';

type ButtonAppearance = 'default' | 'base' | 'secondary';

type ButtonProps = {
	text: String;
	onClick: () => any;
	appearance?: ButtonAppearance;
	disabled?: boolean;
};

export default function Button({ text, onClick, appearance, disabled }: ButtonProps) {
	return (
		<button
			className={`usa-button ${
				appearance && appearance !== 'default' ? 'usa-button--' + appearance : ''
			}`}
			disabled={disabled}
			onClick={onClick}
		>
			{text}
		</button>
	);
}
