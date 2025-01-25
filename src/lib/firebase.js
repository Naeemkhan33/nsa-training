import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpE3btJeE_ONiNPjS-kJS60nXlaYmMhwA",
  authDomain: "razaq-travel.firebaseapp.com",
  projectId: "razaq-travel",
  storageBucket: "razaq-travel.appspot.com",
  messagingSenderId: "1089468298999",
  appId: "1:1089468298999:web:3455345dd685f93b8685f2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
