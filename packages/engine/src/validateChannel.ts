import type { CreateAppChannel } from "./types";

export const validateCreateChannel = (
    channel: CreateAppChannel,
    snapshot: any
) => {
    const validationRules = [
        [!channel.name, "Channel name is required"],
        [channel.name && channel.name.length < 3, "Channel name is too short"],
        [channel.name && channel.name.length > 20, "Channel name is too long"],
        [
            !channel.playlist || channel.playlist.length < 2,
            "At least two polls are required",
        ],
        [!snapshot.empty, "Channel with this name already exists"],
    ];

    const errors = validationRules.reduce((acc, [condition, errorMessage]) => {
        if (condition) {
            acc.push(errorMessage);
        }
        return acc;
    }, []);

    return errors;
};
