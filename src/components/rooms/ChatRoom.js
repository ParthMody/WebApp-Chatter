import React from 'react';
import {Loader, Nav} from "rsuite";
import {Link, useLocation} from "react-router-dom";
import RoomItem from "./RoomItem";
import {useRooms} from "../../context/rooms.context";


function ChatRoom({aboveElHeight}) {

    const rooms=useRooms();
    const location=useLocation();
    return (
        <Nav apperance='subtle' vertical reversed className='overflow-y-scroll custom-scroll'
             style={{height: `calc(100% - ${aboveElHeight}px)`,}}
             activeKey={location.pathname}>
            {!rooms &&( <Loader center vertical content='Loading...' speed='normal' size='md'/>)}
            {rooms && rooms.length>0 && rooms.map(room=>
            <Nav.Item key={room.id} eventKey={`/chat/${room.id}`} componentClass={Link} to={`/chat/${room.id}`}>
                <RoomItem room={room}/>
            </Nav.Item>)}
        </Nav>
    );
}

export default ChatRoom;