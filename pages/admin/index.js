import styles from '@/styles/Admin.module.css';
import AuthCheck from "@/components/AuthCheck";
import Metatags from "@/components/Metatags";
import PostFeed from "@/components/PostFeed";
import { UserContext } from "@/lib/context";
import { firestore, auth } from "@/lib/firebase";
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from 'react-hot-toast';

export default function AdminPostsPage(props) {
	return (
		<main>
			<AuthCheck>
				<Metatags title="admin page" />
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
}

function PostList() {
	const ref = collection(
		firestore,
		'users',
		auth.currentUser.uid,
		'posts'
	);
	const q = query(
		ref,
		orderBy('createdAt', 'desc')
	);
	const [querySnapshot] = useCollection(q);

	const posts = querySnapshot?.docs.map((doc) => doc.data());

	return (
		<>
			<h1>Manage your Posts</h1>
			<PostFeed posts={posts} admin />
		</>
	);
}

function CreateNewPost() {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState("");

	const slug = encodeURI(kebabCase(title));

	const isValid = title.length > 3 && title.length < 100;

	const createPost = async (e) => {
		e.preventDefault();

		const uid = auth.currentUser.uid;
		const ref = doc(
			firestore,
			'users',
			uid,
			'posts',
			slug
		);

		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '# hello world!',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0
		};

		await setDoc(ref, data);

		toast.success("Post created!");

		router.push(`/admin/${slug}`);
	};


	return (
		<form onSubmit={createPost}>
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="My Awesome Article!"
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" disabled={!isValid} className="btn-green">
				Create New Post
			</button>
		</form>
	);
}