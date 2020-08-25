import React, { memo } from 'react';
import { Modal, } from 'react-bootstrap';

export const ModalPopup = memo(({ show, handleToggle, children }) => {
    return <Modal
        show={show}
        onHide={handleToggle}
        aria-labelledby="contained-modal-title-vcenter"
        style={{ top: 100 }}
    >
        <Modal.Header closeButton>
            Add to Shopping List
                </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
    </Modal>
})