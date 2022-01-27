import { google } from "googleapis";
import users from "../db/models/userModel.js";

class googleCalendarOauth {
  constructor() {
    const credentials = {
      installed: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
      },
    };
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    this.oauthClient = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
  }

  setOuathCredentials(token) {
    this.oauthClient.setCredentials(token);
  }

  getToken(code) {
    return new Promise((resolve, reject) => {
      this.oauthClient.getToken(code, (err, token) => {
        if (err) return reject(err);
        this.oauthClient.setCredentials(token);
        console.log(token);
        resolve(token);
      });
    });
  }

  async generateUrl() {
    const SCOPES = ["https://www.googleapis.com/auth/calendar"];
    const authUrl = this.oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    return authUrl;
  }
}

const googleAuthHandler = async ({ ack, body, logger, client }) => {
  logger.info(body);
  await ack();
  const auth = new googleCalendarOauth();
  try {
    const user = await users.findOne({ user_id: body.user_id });
    if (!user) {
      if (body.text === "") {
        const url = await auth.generateUrl();
        await client.chat.postEphemeral({
          channel: body.channel_id,
          user: body.user_id,
          text:
            "Please go to the follwing url and authenticate yourself: \n\n" +
            url,
        });
      } else {
        const code = body.text;
        try {
          const res = await client.users.profile.get({ user: body.user_id });
          const token = await auth.getToken(code);
          const res2 = await users.updateOne(
            { email: res.profile.email },
            {
              access_token: token.access_token,
              refresh_token: token.refresh_token,
              scope: token.scope,
              token_type: token.token_type,
              expiry_date: token.expiry_date,
              user_id: body.user_id,
              email: res.profile.email,
              name: res.profile.real_name_normalized,
            },
            { upsert: true }
          );
          console.log(res2);
          await client.chat.postEphemeral({
            channel: body.channel_id,
            user: body.user_id,
            text: "You are successfully authenticated!",
          });
        } catch (error) {
          logger.error(error);
        }
      }
    } else {
      await client.chat.postEphemeral({
        channel: body.channel_id,
        user: body.user_id,
        text: "You are successfully authenticated!",
      });
    }
  } catch (error) {
    logger.error(error);
    await client.chat.postEphemeral({
      channel: body.channel_id,
      user: body.user_id,
      text: "Encountered some error, please try again later!",
    });
  }
};

const meetingEventHandler = async ({ ack, body, logger, client, say }) => {
  logger.info(body);
  await ack();
  try {
    const user = await users.findOne({ user_id: body.user_id });
    if (!user) {
      await client.chat.postEphemeral({
        channel: body.channel_id,
        user: body.user_id,
        text: "Please authenticate yourself first using /authenticate command!",
      });
    }
    const auth = new googleCalendarOauth();
    const credentials = {
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      scope: user.scope,
      token_type: user.token_type,
      expiry_date: user.expiry_date,
    };
    auth.setOuathCredentials(credentials);
    const calendar = google.calendar({ version: "v3", auth: credentials });
    const data = body.text.split(",");
    const startDate = new Date(parseInt(data[0]));
    const endDate = new Date(parseInt(data[1]));
    const summary = data[2];
    const description = data[3];
    const emails = data[4].split(" ");
    const attendees = emails.map((email) => {
      return { email: email };
    });
    console.log({
      startDate,
      endDate,
      description,
      summary,
      emails,
      attendees,
    });
    const event = {
      summary: summary,
      location: "",
      description: description,
      start: {
        dateTime: startDate,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDate,
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
          requestId:
            "some-random-string" + Math.floor(Math.random() * 900000 + 1),
        },
      },
      attendees: attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    calendar.events.insert(
      {
        auth: auth.oauthClient,
        calendarId: "primary",
        resource: event,
        sendUpdates: "all",
        sendNotifications: true,
        conferenceDataVersion: 1,
      },
      (err, event) => {
        if (err) {
          logger.error(err);
          return;
        }
      }
    );
    await say(
      `Your meeting has been scheduled successfully! \n\nTime: ${startDate} - ${endDate} \n\nSummary: ${summary} \nDescription: ${description} \nAttendees: ${emails}`
    );
  } catch (error) {
    logger.error(error);
  }
};

export { googleAuthHandler, meetingEventHandler };
