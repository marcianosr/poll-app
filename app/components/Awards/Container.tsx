import { Title } from "~/ui/Title";
import { AwardProps, Awards } from ".";

type AwardsContainerProps = AwardProps;

export const AwardsContainer = ({
	users,
	polls,
	seasons,
}: AwardsContainerProps) => (
	<section className="awards-container">
		<Title size="lg" tag="h2" variant="primary">
			Awards
		</Title>
		<Title size="md" variant="primary" tag="span">
			Season {seasons.length + 1}
		</Title>
		<Awards users={users} polls={polls} seasons={seasons} />
	</section>
);
