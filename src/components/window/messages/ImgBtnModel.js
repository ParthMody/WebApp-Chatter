import React from 'react';
import {useModelState} from "../../../misc/custom-hooks";
import {Modal} from "rsuite";

function ImgBtnModel({src,fileName}) {
    const {isOpen,open,close}=useModelState();
    return (
        <>
            <input type='image' src={src} onClick={open} className='mw-100 mh-100 w-auto' alt='file'/>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>{fileName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={src} height='100%' width='100%' alt='file'/>
                </Modal.Body>
                <Modal.Footer>
                    <a href={src} target='_blank' rel='noopener noreferrer'>
                        View original
                    </a>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ImgBtnModel;