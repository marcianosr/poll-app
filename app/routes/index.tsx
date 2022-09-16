import { AwardsBoard } from "~/components/AwardsBoard";

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<AwardsBoard
				polls={[]}
				users={[
					{
						lastPollSubmit: 1663065635336,
						id: "1at5cLzMWad6Kb4bXJGzbuCIe383",
						awards: [],
						email: "ronald.aarnoutse@kabisa.nl",
						polls: {
							correct: 0,
							total: 2,
							answeredById: [Array],
							maxStreak: 0,
							currentStreak: 0,
						},
						displayName: "Ronald Aarnoutse",
						photoURL:
							"https://lh3.googleusercontent.com/a-/AFdZucpn3tjAdFRVHkoLtgpU_ibDRAZ23YB7UPug4x-T=s96-c",
						role: "user",
						total: 1,
					},

					{
						id: "2kDmBd1QNJS0iz9jlmALbdtRw642",
						photoURL:
							"https://lh3.googleusercontent.com/a-/AFdZucqFLeFGwPJ7GF0NY2Xge1zWbPXmWDrKP-b5bVgcgg=s96-c",
						displayName: "Marciano Schildmeijer",
						lastPollSubmit: 1662725001078,
						email: "msrschildmeijer@gmail.com",
						awards: [],
						polls: {
							total: 3,
							answeredById: [Array],
							maxStreak: 0,
							correct: 2,
							currentStreak: 2,
						},
						role: "user",
						total: 1,
					},
				]}
			/>
			<h1>Welcome to Remix</h1>
			<ul>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/jokes"
						rel="noreferrer"
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/docs"
						rel="noreferrer"
					>
						Remix Docs
					</a>
				</li>
			</ul>
		</div>
	);
}
