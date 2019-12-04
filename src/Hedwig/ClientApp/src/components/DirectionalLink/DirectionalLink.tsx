import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Arrow } from '../../assets/images/arrowRight.svg';
// Have to have it inline or we can't inherit color

type DirectionalLinkProps = {
	direction: 'left' | 'right' | 'up' | 'down';
	to: string;
	text: string;
	arrowSide?: 'left' | 'right';
};

export default function DirectionalLink({
	direction = 'right',
	to,
	text,
	arrowSide = 'left',
}: DirectionalLinkProps) {
	const arrow = (
		<Arrow
			className={`oec-directional-link__arrow oec-directional-link__arrow--direction-${direction} oec-directional-link__arrow--side-${arrowSide}`}
		/>
	);
	return (
		<Link to={to} className="oec-directional-link">
			{arrowSide === 'left' && arrow}
			{text}
			{arrowSide === 'right' && arrow}
		</Link>
	);
}
