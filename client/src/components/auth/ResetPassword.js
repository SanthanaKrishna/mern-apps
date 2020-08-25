import React from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form } from 'react-bootstrap';

export const ResetPassword = () => {
    const { register, errors } = useForm();
    return (
        <Container>
            <form>
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
                    <input
                        className="form-control"
                        id="add-item"
                        type="password"
                        name="confirm_password"
                        placeholder='Password'
                        ref={register({
                            required: 'enter your password'
                        })}
                    />
                    {errors.confirm_password?.message}
                </Form.Group>
            </form>
        </Container>
    )
};
