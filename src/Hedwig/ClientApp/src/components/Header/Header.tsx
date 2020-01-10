import React from 'react';
import { matchPath } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { default as NavItem, NavItemProps } from './NavItem';
import closeIcon from 'uswds/src/img/close.svg';

export type HeaderProps = {
	title: string;
	navItems: NavItemProps[];
	loginPath?: string;
	logoutPath?: string;
	userFirstName?: string;
};

type HeaderState = {
	menuIsVisible: boolean;
};

const setActiveStateOfNavItem = function(item: NavItemProps, index: number, path: string) {
	let active: boolean;

	if (index === 0 && path === '/') {
		// By convention, the first section should be active when at the root path
		active = true;
	} else {
		active = !!matchPath(path, { path: item.path });
	}

	return { ...item, active };
};

export class Header extends React.Component<HeaderProps & RouteComponentProps, HeaderState> {
	state = { menuIsVisible: false };

	showMenu = () => {
		this.setState({ menuIsVisible: true });
	};

	hideMenu = () => {
		this.setState({ menuIsVisible: false });
	};

	componentDidMount() {
		window.addEventListener('resize', this.hideMenu);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.hideMenu);
	}

	componentDidUpdate(prevProps: RouteComponentProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.hideMenu();
		}
	}

	render() {
		const {
			title,
			navItems,
			loginPath = '/login',
			logoutPath = '/logout',
			userFirstName,
			location,
		} = this.props;

		const primaryNavItems = navItems
			.filter(item => item.type === 'primary')
			.map((item, index) => setActiveStateOfNavItem(item, index, location.pathname));

		const secondaryNavItems = navItems.filter(item => item.type === 'secondary');

		return (
			<div className={this.state.menuIsVisible ? 'usa-js-mobile-nav--active' : ''}>
				<div
					className={'usa-overlay' + (this.state.menuIsVisible ? ' is-visible' : '')}
					onClick={this.hideMenu}
				></div>
				<header className="usa-header usa-header--extended" role="banner">
					<div className="usa-navbar">
						<div className="usa-logo" id="extended-logo">
           		<Link to="/" aria-label={`${title} home`}>
								<em className="usa-logo__text">
										{title}
								</em>
							</Link>
						</div>
						<button className="usa-menu-btn" onClick={this.showMenu}>
							Menu
						</button>
					</div>
					<nav
						role="navigation"
						className={'usa-nav' + (this.state.menuIsVisible ? ' is-visible' : '')}
					>
						<div className="usa-nav__inner">
							<button className="usa-nav__close" onClick={this.hideMenu}>
								<img src={closeIcon} alt="close" />
							</button>
							<ul className="usa-nav__primary usa-accordion">
								{primaryNavItems.map((item, index) => (
									<NavItem {...item} key={index} />
								))}
							</ul>
							<div className="usa-nav__secondary">
								<ul className="usa-nav__secondary-links">
									{secondaryNavItems.map((item, index) => (
										<NavItem {...item} key={index} />
									))}
									{userFirstName && <NavItem type="secondary" title="Log out" path={logoutPath} />}
								</ul>
								<div className="oec-logged-in-user">
									{userFirstName ? (
										<span>Hi, {userFirstName}.</span>
									) : (
										<Link to={loginPath}>Log in</Link>
									)}
								</div>
							</div>
						</div>
					</nav>
				</header>
			</div>
		);
	}
}

const HeaderWithRouter = withRouter(Header);

export default HeaderWithRouter;
