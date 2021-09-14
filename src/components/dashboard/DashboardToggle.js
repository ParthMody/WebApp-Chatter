import React, {useCallback} from 'react';
import {Alert, Button, Drawer, Icon} from "rsuite";
import {useMediaQuery, useModelState} from "../../misc/custom-hooks";
import Dashboard from "./index";
import {auth, database} from "../../misc/firebase";
import {isOfflineForDatabase} from "../../context/profile.context";


function DashboardToggle(props) {

    const {isOpen,open,close}=useModelState()
    const isMobile=useMediaQuery('(max-width:992px)');

    const onSignOut=useCallback(()=>{
        database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
            auth.signOut();
            Alert.info('Signed Out',4000);
            close();
        }).catch(err => {
            Alert.error(err.message,4000);
        });
    },[close])

    return (
        <>
            <Button block color='orange' onClick={open}>
                <Icon icon='dashboard'/>Dashboard
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
                <Dashboard onSignOut={onSignOut}/>
            </Drawer>
        </>
    );
}

export default DashboardToggle;