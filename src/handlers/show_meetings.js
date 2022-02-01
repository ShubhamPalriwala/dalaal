import meetings from "../db/models/meetingModel.js";

const showMeetingsHandler = async ({ ack, body, logger, client, say }) => {
  await ack();
  try {
    const meets = await meetings.find({ host: body.user_id });
    if (meets.length > 0) {
      const blocks = generateBlocket(meets);
      await say({ blocks });
    } else {
      await say("Lucky you! No meeting are scheduled for you yet!");
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

const generateBlocket = (meetings) => {
  const blocks = [];
  const header = {
    type: "header",
    text: {
      type: "plain_text",
      text: "Your Upcoming Meetings are",
      emoji: true,
    },
  };
  blocks.push(header);
  meetings.forEach((meeting) => {
    const context = {
      type: "context",
      elements: [
        {
          type: "image",
          image_url:
            "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png",
          alt_text: "google_meet",
        },
        {
          type: "mrkdwn",
          text: `<!date^${meeting.start}^{date} at {time}| > to <!date^${meeting.end}^{date} at {time}| >`,
        },
      ],
    };
    const section = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Title*: ${meeting.title} \n *Description*: ${meeting.description[0]}`,
      },
    };
    const divider = {
      type: "divider",
    };
    blocks.push(context);
    blocks.push(section);
    blocks.push(divider);
  });

  return blocks;
};

export default showMeetingsHandler;
