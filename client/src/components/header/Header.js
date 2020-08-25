import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import { Register } from '../auth/Register';
import { Logout } from '../auth/Logout';


export const Header = () => {
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const guestLinks = (
        <Fragment>
            <NavItem>
                <Register />
            </NavItem>
            <NavItem>
                <Link to='/login' />
            </NavItem>
        </Fragment>
    );

    const authLinks = (
        <Fragment>
            <NavItem>
                <span className="navbar-text mr-3">
                    <strong>
                        {user ? user.name : ''}
                    </strong>
                </span>
            </NavItem>
            <NavItem>
                <Logout />
            </NavItem>
        </Fragment>
    );


    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">ShoppingList</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
                <Nav>
                    {isAuthenticated ? authLinks : guestLinks}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
