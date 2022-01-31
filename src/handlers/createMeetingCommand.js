import createMeetingView from "../views/createMeetingView.js";
import initMeetingView from "../views/initMeetingView.js";

const initMeeting = async ({ ack, body, client, logger }) => {
  await ack();
  try {
    const result = await client.views.open(initMeetingView(body.trigger_id));
    logger.info(result);
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

  // console.log("duration:>>", duration);

  const slots = [];

  // TODO: fix slots for more than 1 hr, it schedules
  // in multiples of duration
  for (let i = 0; i < 24; i += duration) {
    let start = i.toString();
    let end = (i + duration).toString();

    if (end > 24) {
      end = 24;
    }

    if (start.length == 1) {
      // console.log(start);
      start = "0" + start;
    }
    if (end.length == 1) {
      // console.log(end);
      end = "0" + end;
    }

    start = start + "00";
    end = end + "00";

    slots.push({
      start,
      end,
    });
  }

  // console.log(slots);
  try {
    const result = await client.views.open(
      createMeetingView(body.trigger_id, slots)
    );
    logger.info(result);
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
  // TODO: add workspace body
  let workspace = "";
  let teamId =
    view["state"]["values"]["b_meeting_team"]["i_meeting_team"].value;
  const user_who_created = body["user"]["id"];

  selectedSlotOptions.forEach((option) => {
    selectedSlots.push(JSON.parse(option.value));
  });

  // console.log("selected:>> ", selectedSlots);

  try {
    await teams.create({
      workspace,
      title: meetingTitle,
      description: meetingDescription,
      preferableSlots: selectedSlots,
      host: user_who_created,
      teamId,
    });

    await client.chat.postMessage({
      channel: user_who_created,
      text: `Meeting has been succesfully created!`,
    });
  } catch (error) {
    console.log("createMeetingCallBack:>> ", error);
  }
};

export { initMeeting, initMeetingCallBack, createMeetingCallBack };
