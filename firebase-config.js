import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCrbC3MYrDJf1-NbFXx21d_8XOvG7hH5mI",
    authDomain: "engmaster-f1e4a.firebaseapp.com",
    projectId: "engmaster-f1e4a",
    storageBucket: "engmaster-f1e4a.appspot.com",
    messagingSenderId: "82671485178",
    appId: "1:82671485178:web:f7f1d55622df02ba30c943",
    measurementId: "G-BKP2FBQ3FP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
    auth, 
    db, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    doc, 
    setDoc, 
    getDoc 
};