
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA58M16PbpikIUszC7aBMM4IYX7MZEcVtU",
  authDomain: "personal-e7c9f.firebaseapp.com",
  databaseURL: "https://personal-e7c9f-default-rtdb.firebaseio.com",
  projectId: "personal-e7c9f",
  storageBucket: "personal-e7c9f.firebasestorage.app",
  messagingSenderId: "507309533413",
  appId: "1:507309533413:web:ba339c71ba020ccdbc0c0c"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
