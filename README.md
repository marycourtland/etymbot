# etymbot
A slack bot to fetch word etymologies. All credit for the entries goes to [the Online Etymology Dictionary](http://www.etymonline.com/). Enjoy!

### Running the bot

This is currently configured to be a custom integration to a private slack channel. [Set it up here](https://my.slack.com/services/new/bot), and copy the API token for the new bot user. Then run:
```
npm install
SLACK_TOKEN=<the-api-token> node index.js
```

### Using the bot

To lookup "word", invite the bot to your channel (or DM it) and type:
> @etymbot: word

Replace `@etymbot` with whatever username you chose for the bot.
