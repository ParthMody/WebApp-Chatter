import React from 'react';
import {usePresence} from "../misc/custom-hooks";
import {Badge, Tooltip, Whisper} from "rsuite";

const getColor=(presence)=>{
    if(!presence){
        return'gray';
    }
    switch (presence.state){
        case 'online':
            return 'green';
        case 'offline':
            return 'red';
        default:
            return 'gray';
    }

};
const getText=(presence)=>{
    if (!presence){
        return 'Status unknown';
    }
    return presence.state==='online'?'Online':`Last Online ${new Date(presence.last_changed).toLocaleDateString()}`

}
function PresenceDot({uid}) {

    const presence=usePresence(uid);
    return (
        <Whisper
            placement="top"
            trigger="hover"
            speaker={
                <Tooltip>
                    {getText(presence)}
                </Tooltip>
            }
        >
            <Badge className='cursor-pointer' style={{backgroundColor:getColor(presence)}}/>
        </Whisper>
    );
}

export default PresenceDot;