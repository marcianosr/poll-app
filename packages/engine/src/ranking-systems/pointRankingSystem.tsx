import { TypedForm, FormDataObject } from "@marcianosrs/form-schema";
import { RankingSystemPlugin } from "../types/ranking-system";
import { produce } from "immer";
import React from "react";

const formDefinition = [
	{
		name: "name",
		fieldType: "text",
		valueType: "string",
		displayName: "Scoreboard name",
		optional: false,
		defaultValue: "",
	},
] as const satisfies TypedForm;

type Ranking = {
	playerId: string;
	points: number;
};

export const pointRankingSystem: RankingSystemPlugin<
	typeof formDefinition,
	{ ranking: Ranking[] }
> = {
	rankingSystemType: "points",
	editForm: formDefinition,
	verifySettings: (
		settings
	): settings is FormDataObject<typeof formDefinition> => true,
	initializeSystemData: () => ({
		ranking: [],
	}),
	processResult: (result, player, _settings, systemData) =>
		produce<typeof systemData>((state) => {
			const playerRanking = state.ranking.find(
				(ranking) => ranking.playerId === player.id
			);

			if (playerRanking) {
				playerRanking.points += result.rawPoints;
			} else {
				state.ranking.push({
					playerId: player.id,
					points: result.rawPoints,
				});
			}
		})(systemData),

	RankingPage: ({ settings, data }) => {
		const sortedRanking = [...data.ranking].sort(
			(a, b) => b.points - a.points
		);
		return (
			<div>
				<h1>{settings.name}</h1>
				<ol>
					{sortedRanking.map(({ playerId, points }) => (
						<li>
							name: {playerId}. points: {points}
						</li>
					))}
				</ol>
			</div>
		);
	},
};
