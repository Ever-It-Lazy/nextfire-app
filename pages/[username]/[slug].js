import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase";
import { collection, collectionGroup, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from '@/styles/Post.module.css';
import PostContent from '@/components/PostContent';

export async function getStaticProps({ params }) {
	const { username, slug } = params;
	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = doc(collection(userDoc.ref, 'posts'), slug);
		post = postToJSON(await getDoc(postRef));

		path = postRef.path;

		return {
			props: { post, path },
			revalidate: 5000
		};
	}
}

export async function getStaticPaths() {

	const snapshot = await getDocs(collectionGroup(firestore, 'posts'));

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug }
		};
	});

	return {
		paths,
		fallback: 'blocking'
	};
}

export default function Post(props) {
	const postRef = getDoc(firestore, props.path);
	const [realtimePost] = useDocumentData(postRef);

	const post = realtimePost || props.post;

	return (
		<main className={styles.container}>
			<section>
				<PostContent post={post} />
			</section>

			<aside className="card">
				<p>
					<strong>{post.hearCount || 0} 🤍</strong>
				</p>
			</aside>
		</main>
	)
}