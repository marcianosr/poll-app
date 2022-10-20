import { Link } from "react-router-dom";
import { useAuth } from "~/providers/AuthProvider";
import styles from "./styles.css";

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const Header = () => {
	const { user, googleLogin, error } = useAuth();

	return (
		<header className="header">
			{user ? (
				<>
					<section className="data">
						<section className="user">
							<img
								referrerPolicy="no-referrer"
								src={user.photoURL || ""}
								width={50}
								height={50}
							/>
							<span>{user.displayName}</span>
						</section>
						<section className="score-container">
							<span>
								Total answered polls:{" "}
								<span className="score">
									{user.firebase.polls.total}
								</span>
							</span>
							<span>
								Total correct answered polls:{" "}
								<span className="score">
									{user.firebase.polls.correct}
								</span>
							</span>
							<span>
								Current streak{" "}
								<span className="score">
									{user.firebase.polls.currentStreak}
								</span>
							</span>
							{/* <span>Max streak {user.firebase.polls.maxStreak}</span> */}
							<Link to={"/polls/new"} className="suggest-poll">
								Suggest poll
							</Link>
						</section>
					</section>
				</>
			) : (
				<button onClick={googleLogin}>Login</button>
			)}
			{error && <h1>something went wrong...</h1>}
		</header>
	);
};
