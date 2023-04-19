import { ScreenState } from "~/routes/polls/$id";

type EekumBokumProps = {
	isAdmin: boolean;
	showVotedBy: boolean;
	setShowVotedBy: (showVotedBy: boolean) => void;
	setScreenState: (state: ScreenState) => void;
};

export const EekumBokum = ({
	isAdmin,
	setShowVotedBy,
	showVotedBy,
	setScreenState,
}: EekumBokumProps) => (
	<>
		{isAdmin && (
			<section className="eekum-bokum-oomenacka">
				<span>Eekum Bokum Oomenacka!</span>
				<input
					type="checkbox"
					id="votedBy"
					onChange={() => setShowVotedBy(!showVotedBy)}
					name="votedBy"
				/>
				<input
					type="checkbox"
					id="screen"
					onChange={() => setScreenState("results")}
					name="screen"
				/>
			</section>
		)}
	</>
);
