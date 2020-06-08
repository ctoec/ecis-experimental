import React, { useContext } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { useHistory } from 'react-router';
import { Button, TextWithIcon } from '../../components';

import { ReactComponent as TeacherWithChalkboard } from '../../assets/images/teacherWithChalkboard.svg';
import { ReactComponent as ArrowDown } from '../../../node_modules/uswds/dist/img/arrow-right.svg';
import HomeCareerBubbleSrc from '../../assets/images/homeCareerBubble.png';

import cx from 'classnames';
import styles from './Home.module.scss';

const Home: any = () => {
	const { user, loading } = useContext(UserContext);
	const history = useHistory();

	// To prevent flash of splash page if user is logged in
	if (loading) {
		return <></>;
	}

	// If the user is logged in, don't show the splash page
	if (user) {
		history.push('/roster');
		return <></>;
	}

	return (
		<div className={cx(styles.container)}>
			<div className={cx('usa-hero', styles.hero)}>
				<div>
					<h1>Welcome to ECE Reporter!</h1>
					<p className="text-bold font-body-lg">Please sign in.</p>
					<Button
						className={cx(styles['btn--inverse'])}
						href="/login"
						text="Sign in"
						appearance="base"
					/>
				</div>
			</div>
			<div className="grid-container margin-top-4">
				<div className="grid-row">
					<div className="tablet:grid-col-fill">
						<h2 className="text-primary text-light margin-y-3">
							Supporting affordable child care in Connecticut
						</h2>
						<p className="line-height-sans-5">
							Publicly-funded early care and education programs use ECE Reporter to share data with
							the Connecticut Office of Early Childhood. We use this data to pay programs and help
							families access quality care.
						</p>
						<div className="display-flex flex-align-center">
							<TeacherWithChalkboard width="45px" />
							<div className="margin-left-2">
								<Button
									text={
										<TextWithIcon
											direction="right"
											iconSide="right"
											text="Read the privacy policy"
											imageFileName="arrowRight"
										/>
									}
									href="/privacy-policy"
								/>
							</div>
						</div>
					</div>
					<div className="tablet:grid-col-2"></div>
					<div className="tablet:grid-col-auto margin-left-12 padding-4">
						<img
							className={cx(styles['hero-bubble'])}
							src={HomeCareerBubbleSrc}
							alt="Children playing on the floor watched by a child care provider"
						/>
					</div>
				</div>
			</div>
			<div className={cx('bg-base-lightest', 'height-15', styles.footer)}>
				<div className="display-flex flex-justify flex-align-center">
					<p className="text-primary text-light font-sans-lg">Find out what's new at OEC</p>
					<Button
						className={cx(styles['usa-button'], 'bg-accent-cool-darker radius-0')}
						text={
							<span className="display-flex flex-align-center">
								<span>Visit the OEC website</span>
								<ArrowDown aria-hidden width="20" height="20" className="margin-left-3" />
							</span>
						}
						href="https://ctoec.org"
						external={true}
						appearance="default"
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
