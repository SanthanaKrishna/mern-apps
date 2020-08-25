import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const AdminRoute = ({ components: Component, ...rest }) => {
    const { isAuthenticated, isLoading, user } = useSelector(state => state.authState);

    return (
        <Route
            {...rest}
            render={props => {
                if (isLoading) {
                    return <p>Loading...</p>
                } else if (user?.role === 'admin') {
                    return <Component {...props} />
                } else {
                    return <Redirect to='/login' />
                }
            }}
        />
    )
};
