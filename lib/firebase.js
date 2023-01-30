import { getApp, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM9ZyOz_YHpsnhReoSQE_QgXyxAOce50A",
  authDomain: "nextfire-8930f.firebaseapp.com",
  projectId: "nextfire-8930f",
  storageBucket: "nextfire-8930f.appspot.com",
  messagingSenderId: "4251467564",
  appId: "1:4251467564:web:761be141be5efd33a7b689"
};

// Initialize Firebase
function createFirebaseApp(config) {
	try {
		return getApp();
	} catch {
		initializeApp(config);
	}
}

const app = createFirebaseApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);
