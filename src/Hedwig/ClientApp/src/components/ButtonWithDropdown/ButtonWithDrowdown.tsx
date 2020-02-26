import React from 'react';
import cx from 'classnames';

import { Button, ButtonProps, InlineIcon } from '..';

import styles from './ButtonWithDropdown.module.scss';
import { Link } from 'react-router-dom';

import useHideOnLostFocus from '../../hooks/useHideOnLostFocus';

type ButtonOptionProps = {
	text: string;
	value: string;
};

type ButtonWithDrowdownProps = ButtonProps & {
	id: string;
	onChange?: (_: React.ChangeEvent<HTMLSelectElement>) => any;
	options: ButtonOptionProps[];
	className?: string;
	dropdownProps?: { className: string } & { svgProps: React.SVGProps<SVGSVGElement> };
	optionsProps?: { className: string };
};

const ButtonWithDrowdown: React.FC<ButtonWithDrowdownProps> = ({
	id,
	appearance,
	text,
	options,
	className,
	dropdownProps,
	optionsProps,
}) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useHideOnLostFocus<HTMLDivElement>();

	return (
		<div id={id} ref={ref} className={cx(
			styles.container,
			{ [styles['container--button-unstyled']]: appearance === 'unstyled'},
			className
		)}>
			<Button
				className={cx(styles['with-dropdown'])}
				appearance={appearance}
				text={
					<span>
						{text}&nbsp;
						<InlineIcon
							icon="angleDown"
							className={dropdownProps && dropdownProps.className}
							svgProps={dropdownProps && dropdownProps.svgProps} />
					</span>
				}
				onClick={() => setIsComponentVisible(hide => !hide)}
			/>
			<div className={cx(
				optionsProps && optionsProps.className,
				{ [styles.hidden]: !isComponentVisible },
				styles.dropdown)
			}>
				{options.map(option => (
					<Link
						className={cx(styles.option)}
						onClick={() => setIsComponentVisible(hide => !hide)}
						to={option.value}
					>
						{option.text}
					</Link>
				))}
			</div>
		</div>
	);
};

export default ButtonWithDrowdown;
