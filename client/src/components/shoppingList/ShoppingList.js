import React, { useState, useEffect, Fragment, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Container, Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';

import { getItemAsync, postItemAsync, deleteLeadAsync } from '../../components/shoppingList/ShoppingListSlice';
import { ModalPopup } from '../Popup/ModalPopup';

export const ShoppingList = memo(() => {
    const dispatch = useDispatch();
    const appState = useSelector(state => state);
    const { authState, shoppingState } = appState;
    const { items, isLoading, error } = shoppingState;
    const { token, isAuthenticated } = authState;
    const { handleSubmit, register, errors } = useForm();
    const [show, setShow] = useState(false);

    useEffect(() => {
        // dispatch(getItemAsync());
    }, []);

    // const handeClick = () => {
    //     const name = prompt('enter the item');
    //     if (name) {
    //         setItems(prevState => ({
    //             ...prevState,
    //             items: [...prevState.items, { id: uuid(), name: name }]
    //         }))
    //     }
    // }
    const handleToggle = useCallback(() => {
        setShow(!show);
    }, [show]);

    const addItems = (data) => {
        // dispatch(postItemAsync(data));
        handleToggle();
    };

    const handleDelete = (id) => {
        dispatch(deleteLeadAsync(id));
    };


    return (
        <Fragment>
            <Button
                color="dark"
                style={{ marginBottom: '2rem' }}
                onClick={handleToggle}
            >
                Add Item
            </Button>
            <ModalPopup show={show} handleToggle={handleToggle} >
                <form onSubmit={handleSubmit(addItems)}>
                    <div className="form-group">
                        <input
                            className="form-control"
                            id="add-item"
                            name="name"
                            placeholder='Enter an Item'
                            ref={register({
                                required: 'provide your items'
                            })}
                        />
                        {errors.name?.message}
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >Submit</button>
                    </div>
                </form>
            </ModalPopup>
            <Container>
                {
                    isLoading ? <h2>Loading....</h2>
                        : items ?
                            <ListGroup>
                                {items.map(({ _id, name }) => (
                                    <ListGroupItem key={_id}>
                                        {isAuthenticated ? (
                                            <Button
                                                className="remove-btn"
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleDelete(_id)}
                                            >&times;
                                            </Button>
                                        )
                                            : null
                                        }
                                        {name}
                                    </ListGroupItem>
                                ))
                                }
                            </ListGroup>
                            : <p>No Items Found</p>
                }
            </Container>
        </Fragment>
    );
});
