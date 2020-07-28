import React from 'react';
import { matchPath } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { default as NavItem, NavItemProps } from './NavItem';
import closeIcon from 'uswds/src/img/close.svg';
import cx from 'classnames';

export type HeaderProps = {
	primaryTitle: string;
	secondaryTitle?: string;
	navItems: NavItemProps[];
	loginPath?: string;
	logoutPath?: string;
	userFirstName?: string;
};

type HeaderState = {
	menuIsVisible: boolean;
};

const setActiveStateOfNavItem = function (item: NavItemProps, index: number, path: string) {
	let active: boolean;

	if (index === 0 && path === '/') {
		// By convention, the first section should be active when at the root path
		active = true;
	} else {
		active = !!matchPath(path, { path: item.path });
	}

	return { ...item, active };
};

class HeaderWithoutRouter extends React.Component<HeaderProps & RouteComponentProps, HeaderState> {
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
			primaryTitle,
			secondaryTitle,
			navItems,
			loginPath = '/login',
			logoutPath = '/logout',
			userFirstName,
			location,
		} = this.props;

		const primaryNavItems = navItems
			.filter((item) => item.type === 'primary')
			.map((item, index) => setActiveStateOfNavItem(item, index, location.pathname));

		const secondaryNavItems = navItems.filter((item) => item.type === 'secondary');

		return (
			<div
				className={cx({
					'usa-js-mobile-nav--active': this.state.menuIsVisible,
				})}
			>
				<div
					data-testid="overlay"
					className={cx('usa-overlay', { 'is-visible': this.state.menuIsVisible })}
					onClick={this.hideMenu}
				></div>
				<header
					className={cx('usa-header', 'usa-header--extended', 'usa-header--oec-default')}
					role="banner"
				>
					<div className={cx('usa-navbar')}>
						<div className={cx('usa-logo')} id="extended-logo">
							<Link to="/" aria-label={`${primaryTitle} home`}>
								<div className={cx('usa-logo__text', 'display-flex', 'flex-align-center')}>
									<div>
										<div
											className={cx('primary-title', {
												'primary-title--only': !secondaryTitle,
											})}
										>
											{primaryTitle}
										</div>
										{secondaryTitle && <div className="secondary-title">{secondaryTitle}</div>}
									</div>
								</div>
							</Link>
						</div>
						<button className={cx('usa-menu-btn')} onClick={this.showMenu}>
							Menu
						</button>
					</div>
					<nav
						role="navigation"
						className={cx('usa-nav', { 'is-visible': this.state.menuIsVisible })}
					>
						<div className={cx('usa-nav__inner')}>
							<button className={cx('usa-nav__close')} onClick={this.hideMenu}>
								<img src={closeIcon} alt="close" />
							</button>
							<ul className={cx('usa-nav__primary usa-accordion')}>
								{primaryNavItems.map((item, index) => (
									<NavItem {...item} key={index} />
								))}
							</ul>
							<div className={cx('usa-nav__secondary', 'usa-nav__secondary--extended')}>
								<ul className={cx('usa-nav__secondary-links')}>
									{secondaryNavItems.map((item, index) => (
										<NavItem {...item} key={index} />
									))}
									{userFirstName && <NavItem type="secondary" title="Log out" path={logoutPath} />}
								</ul>
								<div className={cx('oec-logged-in-user')}>
									{userFirstName ? (
										<span>Hi, {userFirstName}.</span>
									) : (
										<Link to={loginPath}>Sign in</Link>
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

export const Header = withRouter(HeaderWithoutRouter);
