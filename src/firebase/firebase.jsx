import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyDaCEBaPPqqV1ur2sWiugEl_PLsrBERXh0',
  authDomain: 'latex-app-24c21.firebaseapp.com',
  databaseURL: 'https://latex-app-24c21.firebaseio.com',
  projectId: 'latex-app-24c21',
  storageBucket: 'latex-app-24c21.appspot.com',
  messagingSenderId: '630377433016',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();
export { db, auth };
