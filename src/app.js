import pkg from "@slack/bolt";
import connectToDb from "./db/init.js";
import "dotenv/config";
import checkInHanlder from "./handlers/checkIn.js";
import { teamUp, createTeamCallBack } from "./handlers/teamUpCommand.js";
import { googleAuthHandler } from "./handlers/googleCalendar.js";
import {
  createMeetingCallBack,
  initMeeting,
  initMeetingCallBack,
  requestMeetingCallback,
} from "./handlers/createMeetingCommand.js";
import showMeetingsHandler from "./handlers/show_meetings.js";
connectToDb(process.env.MONGODB_URL);
const { App } = pkg;
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.message("dalaal", checkInHanlder);

// Teams
app.command("/create_team", teamUp);
app.view("create_team", createTeamCallBack);

// Meetings
app.command("/meeting", initMeeting);
app.command("/show_meetings", showMeetingsHandler);
app.view("meeting_details", initMeetingCallBack);
app.view("create_meeting", createMeetingCallBack);
app.action("request_meeting", requestMeetingCallback);

// Google Oauth2
app.command("/authenticate", googleAuthHandler);

(async () => {
  await app.start();
  console.log("⚡️ Dalaal app is running!");
})();
