import React, { useContext, useState, createContext } from 'react';
import { Switch } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { NavItemProps } from '../../components/Header/NavItem';
import MakeRouteWithSubRoutes from './MakeRouteWithSubRoutes';
import routes from '../../routes';
import withLogin, { WithLoginPropsType } from '../../contexts/Login';
import 'react-dates/initialize';
import useApi from '../../hooks/useApi';
import { ApiOrganizationsOrgIdReportsGetRequest } from '../../OAS-generated';
import UserContext from '../../contexts/User/UserContext';
import getIdForUser from '../../utils/getIdForUser';

type AppContextType = { invalidateCache: () => void };
export const AppContext = createContext<AppContextType>({ invalidateCache: () => { } });

const App: React.FC<WithLoginPropsType> = ({ accessToken }) => {
  const { user } = useContext(UserContext);

  const params: ApiOrganizationsOrgIdReportsGetRequest = {
    orgId: getIdForUser(user, "org")
  };

  const [cacheInvalidator, setCacheInvalidator] = useState(0);
  const appContext = {
    invalidateCache: () => setCacheInvalidator((prev) => prev + 1)
  };

  const [loading, error, reports] = useApi(
    api => api.apiOrganizationsOrgIdReportsGet(params),
    [accessToken, user, cacheInvalidator]
  );

  const pendingReportsCount =
    !loading &&
    !error &&
    reports &&
    reports.filter(r => !r.submittedAt).length;

  const navItems: NavItemProps[] = [
    { type: 'primary', title: 'Roster', path: '/roster' },
    {
      type: 'primary',
      title: pendingReportsCount && pendingReportsCount > 0 ? `Reports (${pendingReportsCount})` : 'Reports',
      path: '/reports',
    },
    // { type: 'secondary', title: 'Feedback', path: '/feedback' },
    // { type: 'secondary', title: 'Help', path: '/help' },
  ];

  return (
    <div className="App">
      <AppContext.Provider value={appContext}>
        <a className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>
        <Header
          title="Enrollment &amp; Funding"
          navItems={navItems}
          loginPath="/login"
          logoutPath="/logout"
          userFirstName={(user && user.firstName) || undefined}
        />
        <main id="main-content">
          <Switch>
            {routes.map((route, index) => (
              <MakeRouteWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        </main>
      </AppContext.Provider>
    </div>
  );
};

export default withLogin(App);
