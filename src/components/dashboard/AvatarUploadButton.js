import React, {useState,useRef} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {Alert, Button, Modal} from "rsuite";
import {useModelState} from "../../misc/custom-hooks";
import {database, storage} from "../../misc/firebase";
import {useProfile} from "../../context/profile.context";
import ProfileAvatar from "../ProfileAvatar";
import {getUserUpdates} from "../../misc/helper";

const fileInputTypes='.png ,.jpg , .jpeg';
const acceptedFileTypes=['image/png','image/jpeg','image/pjpeg'];

const isValidFile=(file)=>acceptedFileTypes.includes(file.type);

const getBlob=(canvas)=>{
    return new Promise((resolve,reject)=>{
        canvas.toBlob((blob)=>{
            if (blob){
                resolve(blob)
            }
            else {
                reject(new Error('File process error'));
            }

        })
    })
}

function AvatarUploadButton(props) {
    const{isOpen,open,close}=useModelState();
    const {profile}=useProfile()
    const [isLoading,setIsLoading]=useState(false)
    const [img,setImg]=useState(null);
    const avatarEditorRef=useRef();



    const onFileInputChange=(ev)=>{
        const currentFiles=ev.target.files;

        if (currentFiles.length===1){
            const file=currentFiles[0];

            if (isValidFile(file)){
                setImg(file);

                open();
            }
            else {
                Alert.warning(`Incorrect file type ${file.type}`,4000)
            }
        }
    }
    const onUploadClick=async ()=>{
        const canvas=avatarEditorRef.current.getImageScaledToCanvas();

        setIsLoading(true);
        try{
            const blob=await getBlob(canvas);

            const avatarFileRef=storage.ref(`/profiles/${profile.uid}`).child('avatar')

            const uploadAvatarResults=await avatarFileRef.put(blob,{
                cacheControl:`public,max-age=${3600*24*3}`
            });

            const downloadUrl=await uploadAvatarResults.ref.getDownloadURL()

            const updates=await getUserUpdates(profile.uid,'avatar',downloadUrl,database);
            await database.ref().update(updates);

            setIsLoading(false);
            Alert.info('The avatar has been uploaded',4000);
        }
        catch (err){
                setIsLoading(false);
                Alert.error(err.message,4000)
        }
    };

    return (
        <div className='mt-3 text-center'>
            <ProfileAvatar src={profile.avatar} name={profile.name} className='width-200 height-200 img-fullsize font-huge
            '/>
            <div>
                <label htmlFor='avatar-upload' className='d-block cursor-pointer padded'>
                    Select new avatar
                    <input id='avatar-upload' type='file' className='d-none' accept={fileInputTypes} onChange={onFileInputChange}/>
                </label>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>
                            Upload and Adjust Avatar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center align-items-center h-100'>
                        {img &&
                            <AvatarEditor
                                ref={avatarEditorRef}
                                image={img}
                                width={200}
                                height={200}
                                border={10}
                                rotate={0}
                                borderRadius={100}
                            />
                        }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block apperance='ghost' onClick={onUploadClick} disabled={isLoading}>
                            Upload new avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default AvatarUploadButton;