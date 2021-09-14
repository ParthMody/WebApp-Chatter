import React from 'react';
import {useParams} from "react-router";
import {useRooms} from "../../context/rooms.context";
import {Loader} from "rsuite";
import {CurrentRoomProvider} from "../../context/current-room.context";
import {transformToArr} from "../../misc/helper";
import Top from "../../components/window/top/top";
import Messages from "../../components/window/messages/messages";
import Bottom from "../../components/window/bottom/bottom";
import {auth} from "../../misc/firebase";


    const Chat = () => {
        const { chatId } = useParams();

        const rooms = useRooms();

        if (!rooms) {
            return <Loader center vertical size="md" content="Loading...
            " speed="slow" />;
        }

        const currentRoom = rooms.find(room => room.id === chatId);

        if (!currentRoom) {
            return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
        }
        const {name,description}=currentRoom;

        const admins=transformToArr(currentRoom.admins);
        const isAdmin=admins.includes(auth.currentUser.uid);

        const currentRoomData={
            name,
            description,
            admins,
            isAdmin,
        };

    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className="chat-top">
                <Top/>
            </div>
            <div className="chat-middle">
                <Messages />
            </div>
            <div className="chat-bottom">
                <Bottom />
            </div>
        </CurrentRoomProvider>
    );
};

export default Chat;