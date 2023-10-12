# Technical design

## Data Model

```mermaid
classDiagram
    class Channel {
        +String name
        +User owner
    }
    Channel --* ValutaConfig
    Channel --> Theme : DefaultTheme

    class ValutaConfig {
        +String valutaSign
        +String valutaName
    }

    class Season {
        +Date start
        +Date end
        +String name
    }

    Channel <-- Season
    Season --> Theme : Season specific theme
    Season --> Product : Season specific products
    Channel --> ScoreMutator : Default mutator
    Season --> ScoreMutator : Seaon specific mutator

    class PollQuestion {
        +String questionTypePluginId
        +Config questionPluginConfig
        +String status
        +User submitter
        +Array~String~ tags
    }

    PollQuestion <-- Feedback
    Channel --> PollQuestion : Playlist

    Channel --> Product

    class ChannelUser {
        +User user
    }
    Channel --> ChannelUser

    class Product {
        +number price
        +number available
        +Date availableFrom
        +Date availableTill
        +String name
        +Image Image
        +String description
        +number amountUses
        +Date expiryDate
        +number usageDelay
        +CastOption castOption /* Self, Other, NextPlayer */
    }

    Product --> ScoreMutator

    class ScoreMutator {
        +String scoreMutatorPluginTypeId
        +Config scoreMutatorPluginConfig
    }

    class ProductUse {
        +ChannelUser: owner
        +boolean: isCast
        +ChannelUser: targetUser
        +boolean: hasTriggered
        +number: userCountdown /* when cast on next user */
    }

    class Theme {
        +String name
        +String themePluginId
        +Config themePluginConfig
    }
    ProductUse --> ChannelUser
    ProductUse --> Product

    Channel --> ScoreData : Default score systems
    Season --> ScoreData : Season specific score systems

    class ScoreData {
        +String scoreSystemPluginId
        +Config scoreSystemPluginConfig
    }

```

# Plugin model

To allow extensibility in time, and facilitate in different kinds of content, the system will be built up using a plugin architecture.

Plugins allow the system to function in a single way, but the actual flows executed can vary from channel to channel, and season to season.

And because each plugin can be configured before use, a lot of variations are possible without the need to write and deploy code, keeping the system maintainable.

## When is something a plugin?

We call it a plugin when just configuration is not enough, and some actual code needs to be written for the functionality to work.

because the heart of the plugin is actually custom written code, it allows to deal with all kinds of unpredictable future scenario's.

## Identified plugins

Currently we have identified the following plugins:

1. **Themes.** Themes require code for styling, and allow multiple instances where people can also apply configuration, like setting base colors or naming of items used in the user interface.

2. **QuestionTypes.** A poll could be a question with single answer, or one with multiple answers. To allow future extension we turn it in a plugin, so also small games could be added, like HTML Tag memory, connecting lines in a UML diagram, etc. This allows for a lot of new creativity to be added into the platform.

3. **ScoreModifiers.** To add more 'gamification' to the concept, Score modifiers can make the flow more dynamic. Seasons where scores are doubled, or where time becomes a factor, or you can half the points of another player. Or grant yourself more time to answer.

4. **QuestionModifiers.** These modifiers can change the 'gameplay'. Add a time factor to a question, swap right answers for wrong answers, give players an undo or peek. Or see what others have chosen before answering yourself. Is it fair? Who knows. that is up to the community and channel manager to decide.

5. **ScoringSystems.** Getting points that can be modified is nice, but these plugins turn them into a ranking. You want leagues that change based on your points or answering speed? Do you want to play in teams or individually? These plugins make that possible.
