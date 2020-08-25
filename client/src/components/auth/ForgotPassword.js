import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form } from 'react-bootstrap';

export const ForgotPassword = () => {
    const { register, errors, handleSubmit } = useForm();

    const handleForgotPassword = (data) => {
        console.log('handleForgotPassword', data);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit(handleForgotPassword)}>
                <Form.Group>
                    <input
                        className="form-control"
                        id="forgot-pws-email"
                        type="email"
                        name="email"
                        placeholder='Email'
                        ref={register({
                            required: 'Enter your email'
                        })}
                    />
                    {errors.email?.message}
                </Form.Group>
                <Form.Group>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >Send Mail</button>
                </Form.Group>
            </form>
        </Container>
    )
};
