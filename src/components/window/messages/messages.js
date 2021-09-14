import React, {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {auth, database, storage} from "../../../misc/firebase";
import {groupBy, transformToArrWithId} from "../../../misc/helper";
import MessageItem from "./MessageItem";
import {Alert, Button} from "rsuite";
const PAGE_SIZE=15;
const messageRef=database.ref('/messages');

function  Messages(props) {
    const {chatId}=useParams()
    const[messages,setMessages]=useState(null);
    const [limit,setLimit]=useState(PAGE_SIZE);
    const selfRef=useRef()

    const isEmpty=messages && messages.length===0;
    const canShowMessages=messages && messages.length>0;

    const loadMessage=useCallback((limitToLast)=>{

        messageRef.off();
        messageRef
            .orderByChild('roomId')
            .equalTo(chatId)
            .limitToLast(limitToLast || PAGE_SIZE)
            .on("value", (snap)=>{
                const data=transformToArrWithId(snap.val());
                setMessages(data);
            });
        setLimit(p=>p+PAGE_SIZE);
    },[chatId])

    const onLoadMore=useCallback(()=>{

        loadMessage(limit);

    },[loadMessage,limit])


    useEffect(()=>{
        const node=selfRef.current;
        loadMessage(limit)

        setTimeout(()=>{
            node.scrollTop=node.scrollHeight;
        },200)

        return()=>{
            messageRef.off('value');
        }
    },[loadMessage])

    const handleAdmin=useCallback(async (uid)=>{
        const adminsRef=database.ref(`/rooms/${chatId}/admins`);

        let alertMsg;
        await adminsRef.transaction(admins=>{
            if (admins) {
                if (admins[uid]) {
                    admins[uid] = null;
                    alertMsg='Admin permissions removed';
                } else {
                    admins[uid] = true;
                    alertMsg='Admin permissions granted';
                }
            }
            return admins;
        });
        Alert.info(alertMsg,4000)

    },[chatId]);

    const handleLike=useCallback(async (msgId)=>{
        const {uid}=auth.currentUser;
        const messageRef=database.ref(`/messages/${msgId}`);

        let alertMsg;
        await messageRef.transaction(msg=>{
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likeCount -=1;
                    msg.likes[uid]=null;
                    alertMsg='Like removed';
                } else {
                    msg.likeCount +=1;
                    if (!msg.likes){
                        msg.likes={};
                    }
                    msg.likes[uid] = true;
                    alertMsg='Like added';
                }
            }
            return msg;
        });
        Alert.info(alertMsg,4000)
    },[])

    const handleDelete=useCallback(async (msgId,file)=>{

        if (!window.confirm('Delete this message')){
            return;
        }

        const isLast=messages[messages.length-1].id===msgId;

        const updates={};
        updates[`/messages/${msgId}`]=null;

        if (isLast && messages.length>1){
            updates[`/rooms/${chatId}/lastMessage`]={
                ...messages[messages.length -2],
                msgId:messages[messages.length -2].id
            }
        }

        if (isLast && messages.length===1){
            updates[`/rooms/${chatId}/lastMessage`]=null;
        }

        try{
            await database.ref().update(updates)
            Alert.info('The message has been deleted',4000)
        }
        catch (err){
            return Alert.error(err.message,4000);
        }

        if (file) {
            try {
                const fileRef=storage.refFromURL(file.url)
                await fileRef.delete()
            } catch (err) {
                Alert.error(err.message,4000);
            }
        }


    },[chatId,messages])

    const renderMessages=()=>{

        const groups=groupBy(messages,(item)=>
            new Date(item.createdAt).toDateString());

        const items=[];

        Object.keys(groups).forEach((date)=> {
            items.push(<li key={date} className='text-center mb-1 padded'>{date}</li>)

            const msgs = groups[date].map(msg => (
                <MessageItem
                    key={msg.id}
                    message={msg}
                    handleAdmin={handleAdmin}
                    handleLike={handleLike}
                    handleDelete={handleDelete}
                />
            ));
            items.push(...msgs);
        });
        return items;
    };

    return (
        <ul ref={selfRef} className='msg-list custom-scroll'>
            {messages && messages.length >=PAGE_SIZE &&<li>
                <Button className='text-center mt-2 mb-2' onClick={onLoadMore} color='orange'>Load more...</Button>
            </li>}
            {isEmpty && <li>No messages yet...</li>}
            {canShowMessages && renderMessages()}

        </ul>
    );
}

export default Messages;