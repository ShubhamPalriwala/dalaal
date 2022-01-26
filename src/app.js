import pkg from "@slack/bolt";
const { App } = pkg;

import "dotenv/config";

import connectToDb from "./db/init.js";
import checkInHanlder from "./handlers/checkIn.js";
import {
  createMeeting,
  createMeetingCallBack,
} from "./handlers/createMeetingCommand.js";
import { teamUp, createTeamCallBack } from "./handlers/teamUpCommand.js";

connectToDb(process.env.MONGODB_URL);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.message("dalaal checkin", checkInHanlder);

// Team Creation
app.command("/makeateam", teamUp);
app.view("create_team", createTeamCallBack);

app.command("/meeting", createMeeting);
app.view("meeting_details", createMeetingCallBack);

(async () => {
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
