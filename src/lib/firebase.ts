import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigData from "../../firebase-applet-config.json";

export const firebaseConfig = firebaseConfigData;

// Only initialize if we have config (basic stub to allow compilation/run)
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
