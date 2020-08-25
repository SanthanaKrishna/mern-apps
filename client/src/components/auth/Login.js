import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, Container } from 'react-bootstrap';

import { loginAsync } from '../auth/AuthSlice';

export const Login = () => {
    const dispatch = useDispatch();
    const { register, errors, handleSubmit } = useForm();

    const handleLogin = (data) => {
        dispatch(loginAsync(data));
    };

    return (
        <Container>
            <form onSubmit={handleSubmit(handleLogin)}>
                <Form.Group>
                    <input
                        className="form-control"
                        id="add-item"
                        type="email"
                        name="email"
                        placeholder='Email'
                        ref={register({
                            required: 'Enter your emailid'
                        })}
                    />
                    {errors.email?.message}
                </Form.Group>
                <Form.Group>
                    <input
                        className="form-control"
                        id="add-item"
                        type="password"
                        name="password"
                        placeholder='Password'
                        ref={register({
                            required: 'enter your password'
                        })}
                    />
                    {errors.password?.message}
                </Form.Group>
                <Form.Group>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >Login</button>
                </Form.Group>
                <br />
                <Link to="/forgot-password" className="btn btn-sm btn-outline-danger">
                    Forgot Password
                </Link>
            </form>
        </Container>
    )
};
