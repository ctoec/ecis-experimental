import React from 'react';
import { Link } from 'react-router-dom';

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
	direction,
	to,
	text,
	arrowSide = 'left',
	ariaLabel,
}: DirectionalLinkProps) {
	const arrow = <span className={`oec-arrow ${direction} ${arrowSide}`}></span>;
	return (
		<Link to={to} aria-label={ariaLabel}>
			{arrowSide === 'left' && arrow}
			{text}
			{arrowSide === 'right' && arrow}
		</Link>
	);
}
