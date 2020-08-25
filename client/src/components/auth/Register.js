import React, { useCallback, useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NavLink, Form } from 'react-bootstrap';
import { ModalPopup } from '../Popup/ModalPopup';

import { registerAsync } from './AuthSlice';

export const Register = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { handleSubmit, register, errors } = useForm();
    const [show, setShow] = useState(false);


    const handleToggle = useCallback(() => {
        setShow(!show);
    }, [show]);

    const handleSignup = (input) => {
        dispatch(registerAsync(input));
        handleToggle();
        history.push('/verification');
    };

    return (
        <Fragment>
            <NavLink onClick={handleToggle}>
                Register
            </NavLink>
            <ModalPopup show={show} handleToggle={handleToggle} >
                <form onSubmit={handleSubmit(handleSignup)}>
                    <Form.Group>
                        <input
                            className="form-control"
                            id="add-item"
                            name="name"
                            placeholder='Username'
                            ref={register({
                                required: 'Enter your username'
                            })}
                        />
                        {errors.name?.message}
                    </Form.Group>
                    <Form.Group>
                        <input
                            className="form-control"
                            id="add-item"
                            type="email"
                            name="email"
                            placeholder='Email' x
                            ref={register({
                                required: 'Enter your email'
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
                                required: 'Enter password'
                            })}
                        />
                        {errors.password?.message}
                    </Form.Group>
                    <Form.Group>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >Register</button>
                    </Form.Group>
                </form>
            </ModalPopup>
        </Fragment>
    )
};
