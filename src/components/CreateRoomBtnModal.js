import React, {useCallback, useRef, useState} from 'react';
import {useModelState} from "../misc/custom-hooks";
import {Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema} from "rsuite";
import firebase from "firebase/compat/app";
import {auth, database} from "../misc/firebase";


const initialForm={
    name:'',
    description:''
}
const {StringType}=Schema.Types;

const model=Schema.Model({
    name:StringType().isRequired('Chat name is required'),
    description:StringType().isRequired('Description is required')
})
function CreateRoomBtnModal(props) {
    const {isOpen,open,close}=useModelState();
    const [formValue,setFormValue]=useState(initialForm);
    const [isLoading,setIsLoading]=useState(false);
    const formRef=useRef();

    const onFormChange=useCallback((value)=>{
        setFormValue(value);
    },[])

    const onSubmit=async ()=>{
        if(!formRef.current.check()){
            return;
        }
        setIsLoading(true);

        const newRoomdata={
            ...formValue,
            createdAt:firebase.database.ServerValue.TIMESTAMP,
            admins:{
                [auth.currentUser.uid]:true,
            }
        }
        try {
            await database.ref('rooms').push(newRoomdata);
            Alert.info(`${formValue.name} has been created`,4000);
            setIsLoading(false);
            setFormValue(initialForm);
            close();

        }
        catch (err){
            setIsLoading(false);
            Alert.error(err.message,4000);
        }
    }



    return (
        <div className='mt-3'>
            <Button block color='green' onClick={open}>
                <Icon icon='creative'/>Create new chat room
            </Button>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>New Chat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Room name</ControlLabel>
                            <FormControl name='name' placeholder='Enter the name of the chat room...'/>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl componentClass='textarea' rows={5} name='description' placeholder='Enter the room description...'/>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block color='orange' onClick={onSubmit} disabled={isLoading}>
                        Create new chat room
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default CreateRoomBtnModal;