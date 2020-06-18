import React from 'react';
import cx from 'classnames';

export type TextWithIconProps = {
	Icon: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
	text: string;
	direction?: 'left' | 'right' | 'up' | 'down';
	iconSide?: 'left' | 'right';
	className?: string;
	iconClassName?: string;
};

// AKA Old Iconsides
export function TextWithIcon({
	text,
	Icon,
	direction = 'right',
	iconSide = 'left',
	className,
	iconClassName: userSuppliedIconClassName,
}: TextWithIconProps) {
	const iconClassName = `oec-text-with-icon__icon oec-text-with-icon__icon--direction-${direction} oec-text-with-icon__icon--side-${iconSide}`;
	const icon = <Icon className={cx(iconClassName, userSuppliedIconClassName)} />;

	return (
		<span className={cx('oec-text-with-icon', className)}>
			{icon && iconSide === 'left' && icon}
			{text}
			{icon && iconSide === 'right' && icon}
		</span>
	);
}
