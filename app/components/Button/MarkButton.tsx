import { FC } from "react";
import { CorrectAnswerType, NewPollType } from "~/routes/poll/new";

type Props = {
	inputRef: React.RefObject<HTMLInputElement>;
	markCorrectAnswer: CorrectAnswerType[];
	setMarkCorrectAnswer: (markedAnswers: CorrectAnswerType[]) => void;
	field: NewPollType;
};
const MarkButton: FC<Props> = ({
	inputRef,
	markCorrectAnswer,
	setMarkCorrectAnswer,
	field,
}) => {
	return (
		<button
			type="button"
			onClick={() => {
				const input = inputRef.current?.value || "";
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
						value: input,
					},
				]);
			}}
		>
			✅
		</button>
	);
};

export default MarkButton;
