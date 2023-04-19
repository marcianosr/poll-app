import { useEffect, useState } from "react";
import { InputField } from "~/ui/InputField";
import { NewPollType } from "../PollForm";
import { Text } from "~/ui/Text";
import styles from "./styles.css";

type PointsInputFieldProps = {
	field: NewPollType;
	setFields: (fields: NewPollType[]) => void;
	fields: NewPollType[];
};

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

const MAX_AMOUNT_OF_POINTS = 10;

export const PointsInputField = ({
	field,
	setFields,
	fields,
}: PointsInputFieldProps) => {
	const [points, setPoints] = useState(field.points || 0);

	const pointsPerField = fields
		.filter((f) => f.id !== field.id)
		.reduce((acc, f) => acc + (f.points || 0), 0);
	const availablePoints = MAX_AMOUNT_OF_POINTS - pointsPerField;

	useEffect(() => {
		return setFields([
			...fields.map((f) =>
				f.id === field.id
					? {
							...f,
							points,
					  }
					: f
			),
		]);
	}, [points]);

	return (
		<div className="points-input-field-container">
			<Text size="sm" variant="primary">
				Assign amount of points for this answer
			</Text>
			<div className="points-input-field">
				<InputField
					name={`points-${field.id}`}
					id={field.id}
					placeholder="10"
					type="range"
					value={points}
					min={0}
					max={availablePoints}
					onChange={(e) => {
						const inputPoints = Number(e.target.value);
						setPoints(inputPoints);
					}}
				/>

				<Text size="md" variant="primary" tag="span">
					{points}
				</Text>
			</div>
		</div>
	);
};
