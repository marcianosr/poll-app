import { ScreenState } from "~/routes/polls/$id";
import { Title } from "~/ui/Title";
import { PollData } from "~/utils/polls";
import { Ranks } from "../Awards";
import { EekumBokum } from "../EekumBokum";
import {
	PollStatusInfoContainer,
	links as pollStatusInfoContainerLinks,
} from "../PollStatusInfoContainer";
import { links as pollStatusLabelLinks } from "../PollStatusInfoContainer";
import styles from "./styles.css";

export function links() {
	return [
		...pollStatusInfoContainerLinks(),
		...pollStatusLabelLinks(),
		{ rel: "stylesheet", href: styles },
	];
}

type SidebarProps = {
	poll: PollData;
	openedPollNumber: number;
	showVotedBy: boolean;
	setShowVotedBy: (showVotedBy: boolean) => void;
	setScreenState: (screenState: ScreenState) => void;
	isAdmin: boolean;
	users: any;
	polls: PollData[];
};

export const Sidebar = ({
	poll,
	openedPollNumber,
	showVotedBy,
	setShowVotedBy,
	setScreenState,
	isAdmin,
	users,
	polls,
}: SidebarProps) => (
	<aside className="sidebar">
		<PollStatusInfoContainer
			status={poll.status}
			openedPollNumber={openedPollNumber}
			pollNumber={poll.pollNumber || 0}
		/>
		<EekumBokum
			showVotedBy={showVotedBy}
			setShowVotedBy={setShowVotedBy}
			setScreenState={setScreenState}
			isAdmin={isAdmin}
		/>
		<section>
			<Title variant="primary" size="md" tag="h3">
				Ranks
			</Title>
			<Ranks users={users} polls={polls} />
		</section>
	</aside>
);
