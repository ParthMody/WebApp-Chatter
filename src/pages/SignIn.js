import React from 'react';
import firebase from 'firebase/compat/app';
import sigin from '../images/signin.png';
import FadeIn from 'react-fade-in';
import {Container, Grid, Row, Col, Panel, Button, Icon,Alert} from "rsuite";
import {auth,database} from '../misc/firebase';


function SignIn(props) {

    const signInWithProvider = async provider => {
        try {
            const {additionalUserInfo,user}=await auth.signInWithPopup(provider);

            if (additionalUserInfo.isNewUser) {
                await database.ref(`/profiles/${user.uid}`).set({
                    name: user.displayName,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                })

            }

            Alert.success('Signed in', 4000);
        } catch (err) {
            Alert.error(err.message, 4000);
        }
    };

    const onGoogleSignIn=()=>{
        signInWithProvider(new firebase.auth.GoogleAuthProvider())
    };

    return(
        <div style={{ backgroundImage: `url(${sigin})` }}>
        <Container>
        <Grid className='mt-page'>
            <Row>
                <Col xs={24} md={12} mdOffset={6}>
                    <Panel>
                        <div className='text-center'>
                            <FadeIn>
                            <h1>Welcome to WebApp Chatter</h1>
                            <p>A WebApp for chatting</p>
                            </FadeIn>
                        </div>
                        <div className='mt-3'>
                            <Button block color='green' onClick={onGoogleSignIn}>
                                <Icon icon='google'/>Continue with google
                            </Button>
                        </div>
                    </Panel>
                </Col>
            </Row>
        </Grid>
    </Container>
        </div>
    )
};

export default SignIn;