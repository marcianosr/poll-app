import type { ChannelDTO } from "@marcianosrs/engine";
import { createFactory, createTimestamp } from "./factory";

const BASE_CHANNEL: ChannelDTO = {
	id: "factory-id",
	name: "Test Channel",
	slug: "test-channel",
	theme: {
		type: "default",
		data: {},
	},
	createdBy: "user-id",
	frequency: "0 10 * * 1-5",
	startedAt: createTimestamp("2023-10-25T09:50:00.000Z"),
	playlist: [],
	rankingSystems: [],
	createdAt: createTimestamp("2023-10-25T09:15:00.000Z"),
};

export const channelFactory = createFactory(BASE_CHANNEL);
