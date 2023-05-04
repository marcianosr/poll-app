### Architecture

```mermaid
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
```

### Apps

UI - Responsible for building the UI components. Storybook is used to develop and test UI components in isolation.
frontend - Responsible for building the frontend application with Remix and React.
api - Responsible for building the API with Node.js and Express. This agnostic package should provide endpoints the frontend can use to fetch data.
server-auth - Responsible for connecting with firebase-admin to get data from firebase. This package should be used by the api package to get data from firebase.
client-auth - Responsible for providing GoogleAuth login.
