import React, { useState } from 'react';
import cx from 'classnames';

import { Button, ButtonProps } from '..';

import styles from './ButtonWithDropdown.module.scss';
import { Link } from 'react-router-dom';

import useVisibleOnFocus from '../../hooks/useVisibleOnFocus';

type ButtonOptionProps = {
	text: string,
	value: string
}

type ButtonWithDrowdownProps = ButtonProps & {
	id: string,
	onChange: (_: React.ChangeEvent<HTMLSelectElement>) => any,
	options: ButtonOptionProps[]
};

const ButtonWithDrowdown: React.FC<ButtonWithDrowdownProps> = ({
	id,
	appearance,
	text,
	onChange,
	options
}) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useVisibleOnFocus<HTMLDivElement>();

	return (
		<div 
			id={id}
			ref={ref}
			className={cx(styles.container)}
		>
			<Button
				className={cx(styles['with-dropdown'])}
				appearance={appearance}
				text={
					<span>{text}&nbsp;<div className={cx(styles['caret-down'])} /></span>
				}
				onClick={() => setIsComponentVisible(hide => !hide)}
			/>
			<div className={cx(
				{ [styles.hidden]: !isComponentVisible },
				styles.dropdown
			)
			}>
				{options.map(option => 
					<Link
						className={cx(styles.option)}
						onClick={() => setIsComponentVisible(hide => !hide)}
						to={option.value}
					>
						{option.text}
					</Link>
				)}
			</div>
		</div>
	)
}

export default ButtonWithDrowdown;