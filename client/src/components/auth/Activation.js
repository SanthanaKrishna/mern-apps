import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Jumbotron, Container, Button } from 'react-bootstrap';
import { accountActivationAsync } from './AuthSlice';

export const AccountVerification = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { verification, isNewAccount } = useSelector(state => state.authState);

    useEffect(() => {
        if (isNewAccount) {
            history.push('/');
        }
    }, [isNewAccount])

    const verifyAccount = (verificationLink) => {
        dispatch(accountActivationAsync(verificationLink));
    };

    return (
        <Container>
            <Jumbotron>
                <h1>Hi  {verification?.user?.name ?? null},</h1>
                <p>
                    Thank you for registration with us.
                    Please click the below button to verify your email and complete your registration.
                </p>
                <Button variant="primary" onClick={() => verifyAccount(verification?.activationLink ?? null)}>Create your Account</Button>
            </Jumbotron>
        </Container>
    )
};
