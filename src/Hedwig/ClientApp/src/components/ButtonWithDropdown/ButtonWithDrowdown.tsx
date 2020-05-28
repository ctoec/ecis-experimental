import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import useHideOnLostFocus from '../../hooks/useHideOnLostFocus';
import { Button, ButtonProps } from '../Button/Button';
import styles from './ButtonWithDropdown.module.scss';

const {
	container,
	'container--button-unstyled': buttonUnstyled,
	hidden,
	option,
	dropdown,
	'with-dropdown': withDropdown,
} = styles;

type ButtonOptionProps = {
	text: string;
	value: string;
};

type ButtonWithDrowdownProps = ButtonProps & {
	id: string;
	className?: string;
	onChange?: (_: React.ChangeEvent<HTMLSelectElement>) => any;
	dropdownElement: JSX.Element;
	options: ButtonOptionProps[];
	optionsProps?: { className: string };
};

const ButtonWithDrowdown: React.FC<ButtonWithDrowdownProps> = ({
	id,
	appearance,
	text,
	dropdownElement,
	options,
	className,
	optionsProps,
}) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useHideOnLostFocus<HTMLDivElement>();

	return (
		<div
			id={id}
			ref={ref}
			className={cx(container, { [buttonUnstyled]: appearance === 'unstyled' }, className)}
		>
			<Button
				className={withDropdown}
				appearance={appearance}
				text={
					<>
						{text}
						<span>&nbsp;</span>
						{dropdownElement}
					</>
				}
				onClick={() => setIsComponentVisible((hide) => !hide)}
			/>
			<div
				className={cx(
					optionsProps && optionsProps.className,
					{ [hidden]: !isComponentVisible },
					dropdown
				)}
			>
				{options.map((_option) => (
					<Link
						key={_option.value}
						className={option}
						onClick={() => setIsComponentVisible((hide) => !hide)}
						to={_option.value}
					>
						{_option.text}
					</Link>
				))}
			</div>
		</div>
	);
};

export default ButtonWithDrowdown;
