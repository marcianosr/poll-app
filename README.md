### Architecture

flowchart TD

Player

Scheduler

Engine --> Channel
DistributionMechanic --> Engine

subgraph DistributionMechanic
Slack
Web
LinkedIn
Teams
end

Channel --> DistributionMechanic

subgraph Channel
FE[Front end guild]
MB[Mobile guild]
ASML
Signify
Marketing
end

%% Channel has schedule (weekly, daily)
%% Channel has playlist
%% Channel has distribution channel
%% Through capabilities of distribution channel you have concepts like:
%% - trophies
%% - players
%% - seasons
%% - scoring mechanics

Channel --> Season
Channel --> Trophies

Channel --> Content

Content --> Tag

subgraph Tag
CSS
Git
React
A11y
end

subgraph Question
MultipleChoice

    SingleChoice

    CodingChallenge

end

Question --> Content
Question --> Tag
