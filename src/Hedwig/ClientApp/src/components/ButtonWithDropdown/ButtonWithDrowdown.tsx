import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import useHideOnLostFocus from '../../hooks/useHideOnLostFocus';
import { Button, ButtonProps, InlineIcon } from '..';
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
		<div
			id={id}
			ref={ref}
			className={cx(container, { [buttonUnstyled]: appearance === 'unstyled' }, className)}
		>
			<Button
				className={withDropdown}
				appearance={appearance}
				text={
					<span>
						{text}&nbsp;
						<InlineIcon
							icon="arrowDown"
							className={dropdownProps && dropdownProps.className}
							svgProps={dropdownProps && dropdownProps.svgProps}
						/>
					</span>
				}
				onClick={() => setIsComponentVisible(hide => !hide)}
			/>
			<div
				className={cx(
					optionsProps && optionsProps.className,
					{ [hidden]: !isComponentVisible },
					dropdown
				)}
			>
				{options.map(_option => (
					<Link
						key={_option.value}
						className={option}
						onClick={() => setIsComponentVisible(hide => !hide)}
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
