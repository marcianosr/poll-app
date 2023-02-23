import { FC } from "react";
import { CorrectAnswerType, NewPollType } from "~/admin/components/PollForm";

type Props = {
	markCorrectAnswer: CorrectAnswerType[];
	setMarkCorrectAnswer: (markedAnswers: CorrectAnswerType[]) => void;
	field: NewPollType;
};
const MarkButton: FC<Props> = ({
	markCorrectAnswer,
	setMarkCorrectAnswer,
	field,
}) => {
	return (
		<button
			type="button"
			onClick={() => {
				const id = field.id;

				const getItem = markCorrectAnswer.find(
					(item) => item.id === id
				);

				if (getItem) {
					return setMarkCorrectAnswer([
						...markCorrectAnswer.filter((item: any) => {
							return item.id !== id;
						}),
					]);
				}
				return setMarkCorrectAnswer([
					...markCorrectAnswer.filter((item: any) => {
						return item.id !== id;
					}),
					{
						id,
						value: field.value || "",
					},
				]);
			}}
		>
			✅
		</button>
	);
};

export default MarkButton;
