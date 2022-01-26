const { App } = require("@slack/bolt");

require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.message("dalaal checkin", async ({ message, say }) => {
  console.log(message);
  await say(`Yes! I'm here <@${message.user}>!`);
});

(async () => {
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
