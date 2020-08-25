import React, { memo, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { AlertPopup } from '../components/Popup/AlertPopup';
import { ShoppingList } from '../components/shoppingList/ShoppingList';
// import { loadUserAsync } from '../components/auth/AuthSlice';

export const Home = memo(() => {
    const { authState } = useSelector(state => state);
    console.log('state', authState);

    const successAlert = () => {
        if (authState.isNewAccount) {
            return <AlertPopup />
        }
    };

    return (
        <Fragment>
            {successAlert()}
            <ShoppingList />
        </Fragment>
    )

});