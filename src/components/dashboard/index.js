import React from 'react';
import {Alert, Button, Divider, Drawer} from "rsuite";
import {useProfile} from "../../context/profile.context";
import EditableInput from "../EditableInput";
import {database} from "../../misc/firebase";
import AvatarUploadButton from "./AvatarUploadButton";
import {getUserUpdates} from "../../misc/helper";

function Dashboard({onSignOut}) {
    const {profile}=useProfile()
    const onSave=async (newData)=>{
        try {
            const updates=await getUserUpdates(profile.uid,'name',newData,database);
            await database.ref().update(updates);

            Alert.success('Your nickname has been updated',4000);
        }
        catch (err){
          Alert.error(err.message,4000);
        }
    };

    return (
        <>
            <Drawer.Header>
                <Drawer.Title>
                    Dashboard
                </Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
                <h3>Hello,{profile.name}</h3>
                <Divider/>
                <EditableInput
                    name='nickname'
                    initalValue={profile.name}
                    onSave={onSave}
                    label={<h5 className='mb-2'>Nickname</h5>}
                />
                <AvatarUploadButton/>
            </Drawer.Body>

            <Drawer.Footer>
                <Button block color='red' onClick={onSignOut}>Sign Out</Button>
            </Drawer.Footer>
        </>
    );
}

export default Dashboard;