import pkg from "@slack/bolt";
import connectToDb from "./db/init.js";
import "dotenv/config";
import checkInHanlder from "./handlers/checkIn.js";
import { teamUp, createTeamCallBack } from "./handlers/teamUpCommand.js";
import {
  googleAuthHandler,
  meetingEventHandler,
} from "./handlers/googleCalendar.js";
import {
  createMeetingCallBack,
  initMeeting,
  initMeetingCallBack,
  requestMeetingCallback,
} from "./handlers/createMeetingCommand.js";

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

// Team Creation
app.command("/makeateam", teamUp);
app.view("create_team", createTeamCallBack);

// create meeting
app.command("/mc", initMeeting);
app.view("meeting_details", initMeetingCallBack);
app.view("create_meeting", createMeetingCallBack);
app.action("request_meeting", requestMeetingCallback);

// Google Oauth2
app.command("/au", googleAuthHandler);
// Google Calendar scheduling
app.command("/sc", meetingEventHandler);

(async () => {
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
