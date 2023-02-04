import styles from '@/styles/Admin.module.css';
import AuthCheck from "@/components/AuthCheck";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import Metatags from "@/components/Metatags";
import { firestore, auth } from "@/lib/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function AdminPostEdit({ }) {
	return (
		<AuthCheck>
			<Metatags title="admin page" />
			<PostManager />
		</AuthCheck>
	);
}

function PostManager() {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const { slug } = router.query;

	const postRef = doc(
		firestore,
		'users',
		auth.currentUser.uid,
		'posts',
		slug
	);
	const [post] = useDocumentData(postRef);



	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm postRef={postRef} defaultValues={post} preview={preview} />
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? 'Edit' : 'Preview'}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className='btn-blue'>Live view</button>
						</Link>
					</aside>
				</>
			)}
		</main>
	);
}

function PostForm({ defaultValues, postRef, preview }) {
	const { register, handleSubmit, reset, watch, formState: { errors, isValid, isDirty } } = useForm({ defaultValues, mode: 'onChange', criteriaMode: 'all' });

	const updatePost = async ({ content, published }) => {
		await updateDoc(postRef, {
			content,
			published,
			updatedAt: serverTimestamp()
		});

		reset({ content, published });

		toast.success("Post updated successfully!");
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className='card'>
					<ReactMarkdown>{watch('content')}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? styles.hidden : styles.controls}>
				<textarea {...register("content", {
					maxLength: { value: 20000, message: "content is too long" },
					minLength: { value: 10, message: "conent is too short" },
					required: { value: true, message: "content is required" }
				})} ></textarea>

				<ErrorMessage errors={errors} name="content"

					render={({ messages }) =>
					messages &&
						Object.entries(messages).map(([type, message]) => (
							<p className='text-danger' key={type}>{message}</p>
						))
					}
				/>

				<fieldset>
					<input className={styles.checkbox} name="published" type="checkbox" {...register("published")} />
					<label>Published</label>
				</fieldset>

				<button type="submit" className='btn-green' disabled={!isDirty || !isValid}>
					Save Changes
				</button>
			</div>
		</form>
	);
}