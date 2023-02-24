import styles from "./styles.css";
import { Text } from "~/ui/Text";
import { Link } from "@remix-run/react";
import { PollStatisticsContainer } from "~/components/PollStatistics/Container";
import { links as pollStatisticsLinks } from "../PollStatistics";
import { Title } from "~/ui/Title";

export function links() {
	return [...pollStatisticsLinks(), { rel: "stylesheet", href: styles }];
}

export const Footer = () => (
	<footer className="footer">
		<section className="footer-container">
			<section className="contribution-container">
				<Title size="sm" variant="primary" tag="h3">
					Contribute to the poll app
				</Title>
				<ul>
					<li>
						<Text size="xs" variant="primary">
							<a href="https://github.com/marcianosr/poll-app/issues/new">
								Submit an issue
							</a>
						</Text>
					</li>
					<li>
						<Text size="xs" variant="primary">
							<Link to={"/polls/new"}>
								Suggest a poll yourself!
							</Link>
						</Text>
					</li>
				</ul>
			</section>
			<section>
				<PollStatisticsContainer />
			</section>
		</section>
		<section>
			<Text size="xs" variant="primary" tag="small">
				A web app build with ❤️ &{" "}
				<a href="https://remix.run/" target="_blank">
					Remix
				</a>{" "}
				| EST april 2022
			</Text>
		</section>
	</footer>
);
