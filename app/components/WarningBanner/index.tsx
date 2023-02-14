import { Banner } from "~/ui/Banner";
import { Title } from "~/ui/Title";
import { InputTypes } from "~/utils/polls";

type WarningBannerProps = {
	pollType: InputTypes;
};

export const WarningBanner = ({ pollType }: WarningBannerProps) => (
	<Banner size="wide" icon="🚨" variant="warning">
		{pollType === "radio" ? (
			<Title size="md" variant="primary" tag="span">
				Be careful! Only 1 answer is correct
			</Title>
		) : (
			<Title size="md" variant="primary" tag="span">
				Be careful! Multiple answers might be correct
			</Title>
		)}
	</Banner>
);
