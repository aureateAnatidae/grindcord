---
title: Database Design
---

This file outlines the structure of the entities stored by Grindcord, and the rationale in their design. An emphasis is placed on database entities in their role as storage, rather than their function.

In an effort to support compatibility with every database management system (DBMS) supported by Knex.js, we avoid the use of arrays and enums.

Matches are reported to the backend. These reports contain the data:

- The Discord server in which the match was played
- The users who played
- Match count (3-0)
- The fighters used by each respective user

# External Dependencies

A user of Grindcord SHOULD NOT be stored explicitly in our database. A [`GuildMember`](https://discord.com/developers/docs/resources/guild#guild-member-object) is an external dependency provided by Discord. A [`GuildMember`](https://discord.com/developers/docs/resources/guild#guild-member-object)'s `user_id` on the [`user`](https://discord.com/developers/docs/resources/user#user-object) field SHOULD be considered a primary key for our purposes.

A guild SHOULD NOT be stored explicitly in our database. A [`Guild`](https://discord.com/developers/docs/resources/guild#guild-object) is an external dependency provided by Discord. A `Guild`'s `guild_id` SHOULD be considered a primary key for our purposes.

```mermaid
erDiagram
    Guild
    GuildMember
```

# Matches Played by Users

We split this into three tables.

```mermaid
erDiagram
    direction LR
    Match {
        int         match_id    PK
        int         season_id   PK
        datetime    created_at
    }
    MatchPlayer {
        int         match_id    FK,PK
        string      user_id     PK
        int         win_count
    }
    MatchCharacter {
        int         match_id    FK,PK
        string      user_id
        int         fighter_number
    }
    Match ||--|{ MatchPlayer: "is played by"
    MatchPlayer ||..|{ MatchCharacter: "uses"
```

##### Entity Relation Diagram for Matches, storing the data that would be reported by a user.

The winner of the match SHALL be inferred by selecting the `MatchPlayer` record with the highest `win_count` among records with the same `match_id`.

Note that `guild_id` is not stored by the `Match` table. When a match is reported for a particular `guild_id` (a unique ID assigned by Discord for a particular Discord server), the match is reported for that "guild's" current season (see below).

# Seasons for Guilds

```mermaid
erDiagram
    direction LR
    Match {
        int         match_id    PK
        int         season_id   FK
        datetime    created_at
    }
    Season {
        int         season_id   PK
        string      season_name
        datetime    start_at
        datetime    end_at
    }
    GuildSeason {
        string      guild_id    PK
        int         season_id   FK
    }
    Match }|--|| Season: "was played during"
    GuildSeason }|--o| Season: "registers a Guild in a"
```

##### Entity Relation Diagram for Seasons.

More than one guild may participate in a single season, however, a guild may only participate in a single season.

A `Match` is played in a `Season` if the `season_id` matches a `Season` record's `season_id`.

In addition, a `Season` in which participants will be designated an individual tier. Participants in a `Season` are `GuildMember`s who report having participated in a `Match` during a `Season`.

# Tiers for Users Playing Matches

> We recommend some in-memory key-value database to store tiers for current seasons. This is not implemented for the current release of Grindcord.

For past seasons, Grindcord SHALL keep a record of each participating user's role.

```mermaid
erDiagram
    direction LR
    UserSeasonTier {
        string      user_id     PK
        int         season_id   PK,FK
        string      tier_role_id
    }
    Season {
        int         season_id   PK
        string      season_name
        datetime    start_at
        datetime    end_at
    }
    UserSeasonTier ||..|| User: "assigns a tier to"
    UserSeasonTier }|--|| Season: "determines tier in season"
```

A `tier_role_id` is the `role_id` of a role determining the "tier" of a user in a Discord server.

Users in a certain "tier" will gain or lose more or less points, depending on the "tier" of their opponent.

> For example, a user with a role called "Tier 3" can be considered to be in tier 3 of the current season.
> - A user in tier 3 may win 1 point or lose 5 points against a user in tier 1.
> - The same user in tier 3 may win 3 points or lose 2 points against a user in the same tier.
> The names of these roles ("Tier 3" in this example) can be any string. A role should be identified by a role id instead of its name. 

> Edge case: A user may be a member of multiple guilds which participate in a single season, having different tier roles between the guilds. If the roles belong to different tiers in the same season, how can we know the user's true tier?
