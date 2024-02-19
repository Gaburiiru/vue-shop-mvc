import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyBaHMGyRrhsfna-JPW38VOQzbAntxOu6Yk",
  authDomain: "vue-shop-mvc.firebaseapp.com",
  projectId: "vue-shop-mvc",
  storageBucket: "vue-shop-mvc.appspot.com",
  messagingSenderId: "1032162109554",
  appId: "1:1032162109554:web:f1c60f31c07c62a2733aeb",
};

// Initialize Firebase
firebase.initializeApp(config);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { firebase, auth, db, storage };
