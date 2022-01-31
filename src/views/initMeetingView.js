const initMeetingView = (trigger_id) => {
  const initMeetingView = {
    trigger_id,
    view: {
      type: "modal",
      callback_id: "meeting_details",
      title: {
        type: "plain_text",
        text: "My App",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Hello! I will help you host the meeting!",
          },
        },
        {
          type: "divider",
        },
        {
          type: "input",
          block_id: "b_init_meeting",
          element: {
            type: "plain_text_input",
            action_id: "i_meeting_duration",
          },
          label: {
            type: "plain_text",
            text: "How long will the meeting be (in hours)?",
            emoji: true,
          },
        },
      ],
    },
  };
  return initMeetingView;
};

export default initMeetingView;
