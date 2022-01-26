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

  console.log(duration);

  const slots = [];

  // TODO: make slots array
  // divide 24 hours into slots according to duration
  for (let i = 0; i < 24 * 60; i += duration) {
    slots.push({
      start: i,
      end: (i + duration) / 60,
    });
  }

  console.log(slots);
  try {
    // pass teams made and slots to select from
    const result = await client.views.open(createMeetingView(body.trigger_id));
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};

const createMeetingCallBack = async ({ ack, body, view, client, logger }) => {
  await ack();
  // let duration =
  //   view["state"]["values"]["b_init_meeting"]["i_meeting_duration"].value;
  let selectedSlots = [];
  let meetingTitle = "";
  let meetingDescription = "";
  let workspace = "";
  let teamId = "";
  const user_who_created = body["user"]["id"];

  console.log(selectedSlots);

  const result = await client.views.open(createMeetingView(body.trigger_id));
  logger.info(result);
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
    console.log(error);
  }
};
export { initMeeting, initMeetingCallBack, createMeetingCallBack };
