import React, { useState, useEffect } from 'react';

export type TextWithIconProps = {
	direction?: 'left' | 'right' | 'up' | 'down';
	text: string;
	iconSide?: 'left' | 'right';
	imageFileName: string;
};

// AKA Old Iconsides
export function TextWithIcon({
	direction = 'right',
	text,
	iconSide = 'left',
	imageFileName = 'arrowRight',
}: TextWithIconProps) {
	const [icon, updateIcon] = useState(<></>);
	const iconClassName = `oec-text-with-icon__icon oec-text-with-icon__icon--direction-${direction} oec-text-with-icon__icon--side-${iconSide}`;

	useEffect(() => {
		async function fetchComponent() {
			// Have to have svgs inline or we can't inherit color
			const Icon = await import(`../../assets/images/${imageFileName}.svg`);
			updateIcon(<Icon className={iconClassName} />);
		}
		fetchComponent();
	}, []);
	return (
		<span className="oec-text-with-icon">
			{iconSide === 'left' && icon}
			{text}
			{iconSide === 'right' && icon}
		</span>
	);
}
