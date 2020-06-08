import React from 'react';

export type TextWithIconProps = {
	Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
		title?: string | undefined;
	}>;
	text: string;
	direction?: 'left' | 'right' | 'up' | 'down';
	iconSide?: 'left' | 'right';
	className?: string;
};

// AKA Old Iconsides
export function TextWithIcon({
	text,
	Icon,
	direction = 'right',
	iconSide = 'left',
}: TextWithIconProps) {
	const iconClassName = `oec-text-with-icon__icon oec-text-with-icon__icon--direction-${direction} oec-text-with-icon__icon--side-${iconSide}`;
	const icon = <Icon className={iconClassName} />

	return (
		<span className="oec-text-with-icon">
			{icon && iconSide === 'left' && icon}
			{text}
			{icon && iconSide === 'right' && icon}
		</span>
	);
}
