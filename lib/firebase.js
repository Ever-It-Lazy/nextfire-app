import { getApp, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, where, query, getDocs, limit, Timestamp } from "firebase/firestore";
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


/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
	const usersRef = collection(firestore, 'users');
	const q = query(usersRef, where('username', '==', username), limit(1));
	const userDoc = (await getDocs(q)).docs[0];

	return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
	const data = doc.data();

	return {
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis(),
	}
}

export const fromMillis = Timestamp.fromMillis;