import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Home } from '../container/Home';
import { Header } from '../components/header/Header';
import { AccountVerification } from '../components/auth/Activation';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { Login } from '../components/auth/Login';
import { Admin } from '../components/Admin';
import { Private } from '../components/Private';
import { ForgotPassword } from '../components/auth/ForgotPassword';
import { ResetPassword } from '../components/auth/ResetPassword';

export const RootRouter = () => {
    return (
        <Fragment>
            <Router>
                <Header />
                <div className='body-wrapper'>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route path='/activation' component={AccountVerification} />
                        <Route path='/login' component={Login} />
                        <Route path='/forgot-password' component={ForgotPassword} />
                        <Route path='/reset-password' component={ResetPassword} />
                        <PrivateRoute exact path='/private' component={Private} />
                        <AdminRoute exact path='/admin' component={Admin} />
                        <Route path='/' render={() => <div>404</div>} />
                    </Switch>
                </div>
            </Router>
        </Fragment>
    );
};
