import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Arrow } from '../../assets/images/arrowRight.svg';
// Have to have it inline or we can't inherit color

type DirectionalLinkProps = {
	direction: 'left' | 'right' | 'up' | 'down';
	to: string;
	text: string;
	arrowSide?: 'left' | 'right';
	ariaLabel?: string;
	// We prob shouldn't use titles: https://a11yproject.com/posts/creating-valid-and-accessible-links/
	// And we should generally write descriptive link text rather than using aria labels
};

export default function DirectionalLink({
	direction = 'right',
	to,
	text,
	arrowSide = 'left',
	ariaLabel,
}: DirectionalLinkProps) {
	const arrow = (
		<Arrow
			className={`oec-directional-link__arrow oec-directional-link__arrow--direction-${direction} oec-directional-link__arrow--side-${arrowSide}`}
		/>
	);
	return (
		<Link to={to} aria-label={ariaLabel} className="oec-directional-link">
			{arrowSide === 'left' && arrow}
			{text}
			{arrowSide === 'right' && arrow}
		</Link>
	);
}
