import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

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
if (!firebase.app.length) {
	const app = firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
