---
title: Architecture
---

This document describes some of the major internal components of Grindcord and their functionality.

## User Interfaces (Discord, Website)

To communicate with Discord, Grindcord uses the [Gateway API](https://discord.com/developers/docs/reference#gateway-websocket-api) provided by Discord.
Grindcord receives events and commands from the Discord interface.

For a more fluid user experience, a web interface implements all features of the Discord Interface.

## HTTP Backend

For compatibility and extensibility, Grindcord provides a decoupled stateless backend which interfaces primarily with the User Interfaces detailed above, but can interact with any HTTP client.

Multiple backends MAY utilize the same database.

## Database

Grindcord is capable of using most relational database management systems, however, it is developed with SQLite.

We recommend Postgres.

```mermaid
block-beta
columns 1
  db[("Database")]
  space
  backend["HTTP Backend"]
  space
  space
  block:interface
    discord["Discord"]
    webapp["Web App"]
    http_client["Other HTTP Client"]
  end

  db --> backend
  backend --> db
  
  discord --> backend
  backend --> discord

  webapp --> backend
  backend --> webapp

  http_client --> backend
  backend --> http_client

  style interface stroke-dasharray: 5 5
```
###### Block diagram for Grindcord.
