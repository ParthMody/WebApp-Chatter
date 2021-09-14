import React, {useEffect, useState} from 'react';
import {Alert, Button, Icon, InputGroup, Modal, Uploader} from "rsuite";
import {useModelState} from "../../../misc/custom-hooks";
import {storage} from "../../../misc/firebase";
import {useParams} from "react-router";
const MAX_FILE_SIZE=1000*1024*5;

function AttachmentBtnModel({afterUpload}) {
    const {isOpen,open,close}=useModelState();
    const {chatId}=useParams();
    const[fileList,setFileList]=useState([]);
    const[isLoading,setIsLoading]=useState(false);

    const onChange=(fileArr)=>{
        const filtered=fileArr.filter(el=>el.blobFile.size<=MAX_FILE_SIZE).slice(0,5);
        setFileList(filtered);
    };

    const onUpload=async ()=>{
        try{
            const uploadPromise=fileList.map(f=>{
                return storage
                    .ref(`/chat/${chatId}`)
                    .child(Date.now()+f.name)
                    .put(f.blobFile,{cacheControl:`public,max-age=${3600*24*3}`})
            });
            const uploadSnapshots=await Promise.all(uploadPromise);
            const shapePromises=uploadSnapshots.map(async snap=>{
                return{
                    contentType:snap.metadata.contentType,
                    name:snap.metadata.name,
                    url:await snap.ref.getDownloadURL()
                }
            })
            const files=await Promise.all(shapePromises);

            await afterUpload(files);

            setIsLoading(false);
            close();
        }
        catch (err){
            setIsLoading(false);
            Alert.error(err.message,4000);
        }
    };

    return (
        <>
        <InputGroup.Button onClick={open}>
            <Icon icon='attachment'/>
        </InputGroup.Button>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>Upload files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Uploader
                        className='w-100'
                        autoUpload={false}
                        action=''
                        fileList={fileList}
                        onChange={onChange}
                        multiple
                        listType='picture-text'
                        disabled={isLoading}

                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onUpload} disabled={isLoading} block color='green'>
                        Send to chat
                    </Button>
                    <div className='text-right mt-2'>
                        <small>* only files less than 5MB are allowed</small>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AttachmentBtnModel;