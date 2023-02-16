# First steps: usage for multiple groups/guilds

### **Implementing `channel` model**

`channels` are sources of data to use for each single user or multiple users. It is much like how a Spotify “playlist” entity. The `channels` should have the following properties:

-   `category` — overarching category per channel (e.g frontend channel, mobile channel, agile channel, christmas channel, intermediate devs channel)
-   `name` — name of channel
-   `owner` — who moderates this channel
-   `**status` — Status of a poll describing if it is used in this channel or not
-   `polls / pollQueue` — queue of id’s of selected polls that should include this channel, e.g:
    -   `polls: { id: "122345", status: "open" }`
-   `seasons` — id of the related seasons
-   `users` — which users are part of this channel

### Change `polls` data model

**The status property should be changed**

`polls`currently relies on a `status` property. This includes:

-   **open** — to show the poll is now open to vote
-   **closed** — to show the poll was open in the past and has been answered
-   **needs-revision** — to show the poll needs to be moderated due to incompleteness
-   **new** — to show the poll is ready to be used

To migrate “open” en “closed” should not be related to `polls` anymore in favour of the `channels` data model, where statusses such as “open” or “closed” should be managed.

**Support for multiple categories**

It should also be possible to bind multiple categories to a single poll and extend the current `polls` model:

```
category: ["TDD", "JavaScript", "Jest"]
```

This is required to have more specific categories to learn from, e.g `channels` specialised for learning about testing would not include “JavaScript”, but only “TDD” and “Jest”

### UI to manage the channel (Epic)

-   Add a name for the channel
-   Add a category
-   Select polls that should be in the queue
-   Show an alternative page named something like `/channels/{id}` (iso /polls) to manage polls (CRUD, like how it’s working on /polls)

### Users should be able to join a channel

Users should see a list of channels to join on the home page. When not joined, the page should not be accessible.
