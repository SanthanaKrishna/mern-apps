import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ components: Component, ...rest }) => {
    const { isAuthenticated, isLoading } = useSelector(state => state.authState);
    return (
        <Route
            {...rest}
            render={props => {
                if (isLoading) {
                    return <p>Loading...</p>
                } else if (!isAuthenticated) {
                    return <Redirect to='/login' />
                } else {
                    return <Component {...props} />
                }
            }}
        />
    )
};
