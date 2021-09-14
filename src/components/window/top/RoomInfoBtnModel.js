import React ,{memo}from 'react';
import {useCurrentRoom} from "../../../context/current-room.context";
import {Button, Modal} from "rsuite";
import {useModelState} from "../../../misc/custom-hooks";

function RoomInfoBtnModel(props) {

    const {isOpen,open,close}=useModelState();
    const description=useCurrentRoom(v=>v.description);
    const name=useCurrentRoom(v=>v.name);
    return (
        <>
            <Button apperance='link' className='px-0' onClick={open}>
                Room Information
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        About {name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6 className='mb-1'>Description</h6>
                    <p>{description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block color='red' onClick={close}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}

export default memo(RoomInfoBtnModel);