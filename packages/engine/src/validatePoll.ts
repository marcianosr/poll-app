import type { CreatePoll } from "./types";

export const validateCreatePoll = (poll: CreatePoll) => {
    const validationRules = [
        [!poll.question, "Question is required"],
        [!poll.type, "Type is required"],
        [
            !poll.options || poll.options.length < 2,
            "At least two options are required",
        ],
        [
            poll.options.some((option) => !option.value),
            "All options must have a value",
        ],
        [
            poll.options.some(
                (option) =>
                    option.explanation && option?.explanation?.length < 1
            ),
            "Explanation can't be empty",
        ],
        [poll.tags.length < 1, "At least one tag is required"],
        [
            poll.options.filter((option) => option.isCorrect).length < 1,
            "At least one correct answer is required",
        ],
    ];

    const errors = validationRules.reduce((acc, [condition, errorMessage]) => {
        if (condition) {
            acc.push(errorMessage);
        }
        return acc;
    }, []);

    return errors;
};
