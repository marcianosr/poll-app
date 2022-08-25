import { useAuth } from "~/providers/AuthProvider";

const Header = () => {
	const { user, googleLogin, error } = useAuth();

	return (
		<header>
			{user ? (
				<section>
					<img
						referrerPolicy="no-referrer"
						src={user.photoURL || ""}
						width={50}
						height={50}
					/>
					<span>{user.displayName}</span>
					<section>
						<span>
							Total answered polls: {user.firebase.polls.total}
						</span>
						<span>
							Total correct answered polls:{" "}
							{user.firebase.polls.correct}
						</span>
					</section>
				</section>
			) : (
				<button onClick={googleLogin}>Login</button>
			)}
			{error && <h1>something went wrong...</h1>}
		</header>
	);
};

export default Header;
