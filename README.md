# slack-to-discord
Slack to Discord (and Discord to Slack!) bridge

## Install
```sh
git clone https://github.com/Repflez/slack-to-discord && slack-to-discord
npm install
```

## Configuration
This "bot" was made about a year ago, before webhooks on Discord were a thing, so this requires a bot user on both sides (On Slack, [make a bot user for your team](https://my.slack.com/services/new/bot). You should already know how to add a Discord bot to your server)

Once you have it, edit `bridge.js` and change the constants you see on it:
```
SLACK_BOT_KEY = Slack Bot Token
DISCORD_BOT_TOKEN = Discord Bot Token
SLACK_TEAM_ID = Slack Team ID
DISCORD_GUILD_ID = Discord Server ID
SLACK_BOT_ID = Slack Bot ID
DISCORD_BOT_ID = Discord Bot ID
```

## Configuring channels
Open `chans.json` and edit it to your linking. The file is structured like that so you can have the posibility to make a one-way bridge to any Slack/Discord channel.

## Stuff that was never made
- DM Support
- Attachment Support
- Discord nickname support?
