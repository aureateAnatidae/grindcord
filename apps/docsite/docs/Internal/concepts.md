---
title: Concepts and Vocabulary
---

# Disambiguation

## Use the word `Match` over `Set` to refer to recorded games
When we refer to the games played between players, which are reported to Grindcord, we use the term "match" over "set". 

Despite "set" being more common to refer to a past game, it already has a meaning in programming (the data structure) and may cause confusion. Using the word `Set` or `set` in code may also shadow the built-in `Set()` object in code.

## GuildMember/User
Grindcord is built for communities on Discord. Every user of Grindcord must also be a member of a guild (a Discord server) which has Grindcord installed.

A user of Grindcord is uniquely identied by their `id` (that we disambiguate as `user_id`), and their participation in a guild with a `guild_id`. So, a [`GuildMember`](https://discord.com/developers/docs/resources/guild#guild-member-object) is an object from the Discord API which represents a [`user`](https://discord.com/developers/docs/resources/user#user-object) and their participation in that guild.
