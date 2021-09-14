import React, {useEffect, useRef, useState} from 'react';
import DashboardToggle from "./dashboard/DashboardToggle";
import CreateRoomBtnModal from "./CreateRoomBtnModal";
import {Divider} from "rsuite";
import ChatRoom from "./rooms/ChatRoom";

function Sidebar(props) {
    const topSidebarRef=useRef();
    const [height,setHeight]=useState(0);
    useEffect(()=>{
        if(topSidebarRef.current){
            setHeight(topSidebarRef.current.scrollHeight)
        }
    },[topSidebarRef])

    return (
        <div className='h-100 pt-1'>
            <div ref={topSidebarRef}>
                <DashboardToggle/>
                <CreateRoomBtnModal/>
             <Divider>Join conversation</Divider>
            </div>
            <ChatRoom aboveElHeight={height}/>
        </div>
    );
}

export default Sidebar;