import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  // @ts-ignore
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaadboJnuYP6DuS5NXVHqTyhu6imi40Pk",
  authDomain: "pizzaapp-f467d.firebaseapp.com",
  projectId: "pizzaapp-f467d",
  storageBucket: "pizzaapp-f467d.firebasestorage.app",
  messagingSenderId: "545840201390",
  appId: "1:545840201390:web:58a91fc0a11da531d0373f",
  measurementId: "G-ZW3LMZNXKG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  // @ts-ignore
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
