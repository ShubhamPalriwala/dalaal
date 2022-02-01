import meetings from "../db/models/meetingModel.js";
import createMeetingView from "../views/createMeetingView.js";
import initMeetingView from "../views/initMeetingView.js";
import users from "../db/models/userModel.js";
import { givePreferredSlot } from "./givePreferredSlot.js";
import { emailCollector } from "./googleCalendar.js";

const initMeeting = async ({ ack, body, client, logger }) => {
  await ack();
  try {
    const userData_who_created = await users.findOne({
      user_id: body.user_id,
    });
    if (!userData_who_created) {
      await client.chat.postEphemeral({
        channel: body.channel_id,
        user: body.user_id,
        text: "Please authenticate yourself using the /authenticate command to schedule a meeting!",
      });
      return;
    }
    if (!userData_who_created.isAuthenticated) {
      await client.chat.postEphemeral({
        channel: body.channel_id,
        user: body.user_id,
        text: "Please authenticate yourself using the /authenticate command to schedule a meeting!",
      });
      return;
    }
    await client.views.open(initMeetingView(body.trigger_id));
  } catch (error) {
    logger.error(error);
  }
};

const initMeetingCallBack = async ({ ack, body, view, client, logger }) => {
  await ack();
  let duration =
    view["state"]["values"]["b_init_meeting"]["i_meeting_duration"].value;

  const user_who_created = body["user"]["id"];

  duration = parseInt(duration);

  const slots = [];

  for (let i = 0; i < 24; i += 1) {
    let start = i.toString();
    let end = (i + duration).toString();

    if (end > 24) {
      end = 24;
    }

    if (start.length == 1) {
      start = "0" + start;
    }
    if (end.length == 1) {
      end = "0" + end;
    }

    start = start + "00";
    end = end + "00";

    slots.push({
      start,
      end,
    });
  }

  try {
    const result = await client.views.open(
      createMeetingView(body.trigger_id, slots)
    );
    // logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};

const createMeetingCallBack = async ({ ack, body, view, client, logger }) => {
  await ack();
  let selectedSlotOptions =
    view["state"]["values"]["b_meeting_slots"]["i_selected_slots"]
      .selected_options;
  let selectedSlots = [];
  let meetingTitle =
    view["state"]["values"]["b_meeting_title"]["i_meeting_title"].value;
  let meetingDescription =
    view["state"]["values"]["b_meeting_desc"]["i_meeting_desc"].value;
  let meetingAttendees =
    view["state"]["values"]["b_meeting_attendees"]["i_meeting_attendees"]
      .selected_users;
  // TODO: add workspace body
  let workspace = "sample";
  let teamId =
    view["state"]["values"]["b_meeting_team"]["i_meeting_team"].value;
  const userWhoCreated = body["user"]["id"];

  selectedSlotOptions.forEach((option) => {
    selectedSlots.push(JSON.parse(option.value));
  });

  try {
    var filteredAttendees = meetingAttendees.filter(function (value) {
      return value != userWhoCreated;
    });
    await emailCollector(filteredAttendees, client);
    const meetingfromdb = await meetings.create({
      workspace,
      title: meetingTitle,
      description: meetingDescription,
      preferableSlots: selectedSlots,
      host: userWhoCreated,
      invitees: filteredAttendees,
    });

    const options = [];

    selectedSlots.forEach((slot) => {
      let obj = {
        text: {
          type: "plain_text",
          text: slot.start + " to " + slot.end,
          emoji: true,
        },
        value: JSON.stringify(slot),
      };
      options.push(obj);
    });

    const userData = await users.findOne({ user_id: userWhoCreated });

    for (const attendee of filteredAttendees) {
      await client.chat.postMessage({
        channel: attendee,
        text: `${meetingfromdb._id}`,

        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Hey there! You are invited to a meeting by ${userData.name}`,
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Meeting title: ${meetingTitle}? \n Description: ${meetingDescription}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Select the preferable timeslot for the meeting",
            },
            block_id: "b_meeting_slots",
            accessory: {
              type: "multi_static_select",
              placeholder: {
                type: "plain_text",
                text: "Select options",
                emoji: true,
              },
              options,
              action_id: "request_meeting",
            },
          },
        ],
      });
    }

    await client.chat.postMessage({
      channel: userWhoCreated,
      text: `Meeting has been succesfully created and attendees have been notified!`,
    });
  } catch (error) {
    console.log("createMeetingCallBack:>> ", error);
  }
};

const requestMeetingCallback = async ({ ack, body, view, client, logger }) => {
  await ack();
  let preferedSlot = JSON.parse(
    body.state.values.b_meeting_slots.request_meeting.selected_options[0].value
  );
  const meetingId = body.message.text;

  try {
    await givePreferredSlot(preferedSlot, body.user.id, meetingId, client);
  } catch (error) {
    logger.error(error);
  }
};

export {
  initMeeting,
  initMeetingCallBack,
  createMeetingCallBack,
  requestMeetingCallback,
};
