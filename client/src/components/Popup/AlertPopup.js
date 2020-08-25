import React, { useState } from 'react';
import { Toast, Fade } from 'react-bootstrap';

export const AlertPopup = () => {
    const [show, setShow] = useState(true)

    return (
        <div aria-live="polite" aria-atomic="true" style={{ position: 'relative' }}>
            <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide style={{ position: 'absolute', top: 0, right: 0 }} >
                <Toast.Header>
                    Your account is created successfully
                </Toast.Header>
            </Toast>
        </div>
    )
};
