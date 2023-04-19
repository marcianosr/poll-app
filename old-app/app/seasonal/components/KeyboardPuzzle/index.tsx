import { useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { LoaderData } from "~/routes/polls/$id";
import { EggConditional } from "~/seasonal/Egg/EggContainer";
import styles from "./styles.css";
import { Text } from "~/ui/Text";

export const links = () => [{ rel: "stylesheet", href: styles }];

const correctWord = "frontendpollsarecool";

const getPuzzleWord = () => {
	const randomizedWord = correctWord
		.split("")
		.sort(() => Math.random() - 0.5)
		.join("");

	return randomizedWord;
};

const isCorrectLetter = (correct: string, letter: string) => letter === correct;

export const KeyboardPuzzle = () => {
	const { poll } = useLoaderData() as LoaderData;
	const [word] = useState(getPuzzleWord());
	const [typing, setTyping] = useState(false);
	const [typedWord, setTypedWord] = useState("");
	const [guessedRight, setGuessRight] = useState<boolean | null>(null);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null;

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (disabled) return;
			setTyping(true);
			setTypedWord((prev) => prev + event.key);

			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}

			if (
				!isCorrectLetter(
					correctWord.charAt(typedWord.length),
					event.key
				)
			) {
				setDisabled(true);
				timeoutId = setTimeout(() => {
					resetInput();
					setGuessRight(null);
					setDisabled(false);
				}, 2000);
			} else {
				timeoutId = setTimeout(() => {
					setTyping(false);
					if (typedWord === correctWord) {
						setGuessRight(true);
					}
					resetInput();
				}, 2000);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
		};
	}, [disabled, typedWord]);

	useEffect(() => {
		if (typedWord === correctWord) {
			setGuessRight(true);
			setDisabled(true);
		}
	}, [typedWord]);

	const resetInput = () => setTypedWord("");

	const getLetterClassNames = (letterIndex: number) => {
		if (typedWord.length >= letterIndex + 1) {
			const typedLetter = typedWord.charAt(letterIndex);
			const correctLetter = correctWord.charAt(letterIndex);
			return classNames("letter", {
				"letter-correct": isCorrectLetter(correctLetter, typedLetter),
				"letter-incorrect": !isCorrectLetter(
					correctLetter,
					typedLetter
				),
				disabled: disabled,
			});
		} else {
			return "letter";
		}
	};

	return (
		<section className="keyboard-puzzle-container">
			{guessedRight ? (
				<>
					{poll.category === "javascript" ? (
						<div style={{ padding: "2rem" }}>
							<EggConditional size="xl" id="5" category="js" />
						</div>
					) : (
						<Text size="md" variant="primary">
							That was a secret you found, but I have to
							dissapoint you that the prize in this category is
							not around!
						</Text>
					)}
				</>
			) : (
				<>
					{word.split("").map((letter, idx) => (
						<div className={getLetterClassNames(idx)}>{letter}</div>
					))}
				</>
			)}
		</section>
	);
};
