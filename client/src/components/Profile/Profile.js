import React from 'react';
import { useForm } from 'react-hook-form';
import { Container } from 'react-bootstrap';

export const Profile = () => {
    const { register, errors, handleSubmit } = useForm();

    const updateProfile = (data) => {
        console.log('updateProfile', data)
    };
    return (
        <Container>
            <form onSubmit={handleSubmit(updateProfile)}>
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
            </form>
        </Container>
    )
}
