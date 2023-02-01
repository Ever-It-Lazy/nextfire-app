import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import { collection, where, query, orderBy, getDocs, limit } from "firebase/firestore";


export async function getServerSideProps(context) {
	const { username } = context.query;

	const userDoc = await getUserWithUsername(username);

	if (!userDoc) {
		return {
			notFound: true
		};
	}

	let user = null;
	let posts = null;

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = query(
			collection(userDoc.ref, 'posts'),
			where('published', '==', true),
			orderBy('createdAt', 'desc'),
			limit(5)
		);
		posts = (await getDocs(postsQuery)).docs.map(postToJSON);
	}

	return {
		props: { user, posts },
	};
}

export default function UserProfilePage({ user, posts }) {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} />
		</main>
	)
}