import AuthCheck from "@/components/AuthCheck";
import Metatags from "@/components/Metatags";

export default function AdminPostsPage(props) {
	return (
		<main>
			<AuthCheck>
				<Metatags title="admin page" />
				<h1>Admin posts</h1>
			</AuthCheck>
		</main>
	)
}