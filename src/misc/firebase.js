import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
const config = {
    apiKey: "AIzaSyDK-GkgidJVf5VnByjJ9JlBMYSfPstoKFw",
    authDomain: "chat-app-web-19cd2.firebaseapp.com",
    databaseURL: "https://chat-app-web-19cd2-default-rtdb.firebaseio.com",
    projectId: "chat-app-web-19cd2",
    storageBucket: "chat-app-web-19cd2.appspot.com",
    messagingSenderId: "675453783220",
    appId: "1:675453783220:web:5965fac4b3c0f49bcc5be1"
};

const app=firebase.initializeApp(config);
export const auth=app.auth();
export const database=app.database();
export const storage=app.storage();