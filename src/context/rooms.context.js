import {createContext, useState,useEffect,useContext} from "react";
import {transformToArrWithId} from "../misc/helper";
import {database} from "../misc/firebase";

const RoomsContext=createContext()

export const RoomProvider=({children})=>{
    const [rooms,setRooms]=useState(null);

    useEffect(() => {
        const roomListRef = database.ref('rooms');

        roomListRef.on('value', snap => {
            const data = transformToArrWithId(snap.val());
            setRooms(data);
        });

        return () => {
           roomListRef.off();
        };
    }, []);

    return (
        <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
    );
};

export const useRooms = () => useContext(RoomsContext);