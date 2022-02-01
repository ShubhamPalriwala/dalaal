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
          text: `Please go to the follwing url and authenticate yourself below \n\n <${url}|*Click here to authenticate yourself!*>`,
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
              isAuthenticated: true,
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

const emailCollector = async (userIds, client) => {
  for (const user of userIds) {
    const userData = await users.findOne({ user_id: user });
    if (!userData) {
      const res = await client.users.profile.get({ user });
      await users.updateOne(
        { email: res.profile.email },
        {
          user_id: user,
          email: res.profile.email,
          name: res.profile.real_name_normalized,
          isAuthenticated: true,
        },
        { upsert: true }
      );
    }
  }
};

const userDataGather = async (attendees) => {
  const final_emails = [];
  for (const attendee of attendees) {
    const res = await users.findOne({ user_id: attendee });
    if (!res) {
      console.log("attendee not found!");
    }
    final_emails.push(res.email);
  }
  return final_emails;
};

const triggerMeeting = async (startTime, endTime, updatedMeeting, client) => {
  const userWhoScheduled = await users.findOne({
    user_id: updatedMeeting.host,
  });
  if (!userWhoScheduled) {
    console.log("scheduler not found!");
    return;
  }
  const emails = await userDataGather(updatedMeeting.invitees);
  const attendees = emails.map((email) => {
    return { email: email };
  });

  //Creation of Google Calendar Event
  const auth = new googleCalendarOauth();
  const credentials = {
    access_token: userWhoScheduled.access_token,
    refresh_token: userWhoScheduled.refresh_token,
    scope: userWhoScheduled.scope,
    token_type: userWhoScheduled.token_type,
    expiry_date: userWhoScheduled.expiry_date,
  };
  auth.setOuathCredentials(credentials);
  const calendar = google.calendar({ version: "v3", auth: credentials });
  console.log("Event created!", {
    startTime,
    endTime,
    updatedMeeting,
    attendees,
  });
  const event = {
    summary: updatedMeeting.title,
    location: "",
    description: updatedMeeting.description[0],
    start: {
      dateTime: startTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime,
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
    async (err, event) => {
      if (err) {
        console.log(err);
        console.log(err.data.error);
        return;
      }
      await client.chat.postMessage({
        channel: updatedMeeting.host,
        text: `Hey ${
          userWhoScheduled.name
        }!, your meeting has been scheduled! at <!date^${Math.floor(
          startTime.getTime() / 1000
        )}^{date} at {time}| > to <!date^${Math.floor(
          endTime.getTime() / 1000
        )}^{date} at {time}| >`,
      });
      for (const invitee of updatedMeeting.invitees) {
        await client.chat.postMessage({
          channel: invitee,
          text: `Hey there!, your meeting has been scheduled at <!date^${Math.floor(
            startTime.getTime() / 1000
          )}^{date} at {time}| > to <!date^${Math.floor(
            endTime.getTime() / 1000
          )}^{date} at {time}| > ! Please check your e-mail to learn more`,
        });
      }
    }
  );
};

export { googleAuthHandler, emailCollector, triggerMeeting };
