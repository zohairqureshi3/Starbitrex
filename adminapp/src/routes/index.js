import NotFound from '../components/NotFound'
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import routes from './routes'
import AuthLayout from "../layout/AuthLayout";
import PrivateLayout from "../layout/PrivateLayout";
import AffiliateLayout from '../layout/AffiliateLayout';
import AffiliateAuthLayout from '../layout/AffiliateAuthLayout';

const MainRoutes = (props) => {
    const AuthLayoutRoute = ({ component: Component, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <AuthLayout>
                        <Component {...matchProps} />
                    </AuthLayout>
                )}
            />
        );
    };

    const PrivateLayoutRoute = ({ component: Component, path, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <PrivateLayout>
                        <Component {...matchProps} />
                    </PrivateLayout>
                )}
            />
        );
    };

    const AffiliateAuthLayoutRoute = ({ component: Component, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <AffiliateAuthLayout>
                        <Component {...matchProps} />
                    </AffiliateAuthLayout>
                )}
            />
        );
    };

    const AffiliateLayoutRoute = ({ component: Component, path, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(matchProps) => (
                    <AffiliateLayout>
                        <Component {...matchProps} />
                    </AffiliateLayout>
                )}
            />
        );
    };

    return (
        <Router>
            <Switch>
                {routes.filter(route => route.layout == "AuthLayoutRoute").map((route, index) => (
                    <AuthLayoutRoute exact={route.exact} path={route.path} component={route.component} key={index} />
                ))}
                {routes.filter(route => route.layout == "PrivateLayoutRoute").map((route, index) => (
                    <PrivateLayoutRoute exact={route.exact} path={route.path} component={route.component} key={index} />
                ))}
                {routes.filter(route => route.layout == "AffiliateAuthLayoutRoute").map((route, index) => (
                    <AffiliateAuthLayoutRoute exact={route.exact} path={route.path} component={route.component} key={index} />
                ))}
                {routes.filter(route => route.layout == "AffiliateLayoutRoute").map((route, index) => (
                    <AffiliateLayoutRoute exact={route.exact} path={route.path} component={route.component} key={index} />
                ))}
                <Route path='*' component={NotFound} />
            </Switch>

        </Router>
    )
}

export default MainRoutes;
