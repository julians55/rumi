import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAFsjw_SK4tfJ0wRsVt3_F2MPjeSTGSXDM",
    authDomain: "rumi-a4b79.firebaseapp.com",
    projectId: "rumi-a4b79",
    storageBucket: "rumi-a4b79.appspot.com",
    messagingSenderId: "177325171018",
    appId: "1:177325171018:web:f97bee605cc7ba7699e1b3",
    measurementId: "G-XFDXMZRTTT"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };