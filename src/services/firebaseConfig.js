import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBerB8itda5y7fGc3vhd96ir7pQ18RvCLg",
  authDomain: "react-auth-31116.firebaseapp.com",
  projectId: "react-auth-31116",
  storageBucket: "react-auth-31116.appspot.com",
  messagingSenderId: "262574097741",
  appId: "1:262574097741:web:da2dc9335cc4947daf6304",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

