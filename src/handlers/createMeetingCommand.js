import createMeetingView from "../views/createMeetingView.js";

const createMeeting = async ({ ack, body, client, logger }) => {
  await ack();
  try {
    const result = await client.views.open(createMeetingView(body.trigger_id));
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};

const createMeetingCallBack = async ({ ack, body, view, client, logger }) => {
  await ack();
  const duration =
    view["state"]["values"]["b_init_meeting"]["i_meeting_duration"].value;

  const user_who_created = body["user"]["id"];

  console.log(duration);

  try {
    await client.chat.postMessage({
      channel: user_who_created,
      text: `Meeting has been succesfully created for ${duration}!`,
    });
  } catch (error) {
    console.log(error);
  }
};

export { createMeeting, createMeetingCallBack };
