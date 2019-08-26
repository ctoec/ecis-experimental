import React from 'react';
import { Link } from 'react-router-dom';

type NavItemType = 'primary' | 'secondary';

export type NavItemProps = {
	title: string;
	path: string;
	type: NavItemType;
	active?: boolean;
	attentionNeeded?: boolean;
};

export default function NavItem({
	title,
	path,
	type,
	active = false,
	attentionNeeded = false,
}: NavItemProps) {
	switch (type) {
		case 'primary':
			return (
				<li className="usa-nav__primary-item">
					<Link className={'usa-nav__link' + (active ? ' usa-current' : '')} to={path}>
						<span>
							{title}
							{attentionNeeded && (
								<span className="attention-needed">
									&nbsp;&bull;
									<span className="usa-sr-only"> (attention needed)</span>
								</span>
							)}
						</span>
					</Link>
				</li>
			);
		case 'secondary':
			return (
				<li className="usa-nav__secondary-item">
					<Link to={path}>{title}</Link>
				</li>
			);
	}
}
