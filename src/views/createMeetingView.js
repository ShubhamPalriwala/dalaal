const createMeetingView = (trigger_id) => {
  const createMeetingView = {
    trigger_id,
    view: {
      type: "modal",
      callback_id: "create_meeting",
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
            text: "Step 2: Select timings",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Select the preferable timeslot for the meeting",
          },
          accessory: {
            type: "multi_static_select",
            placeholder: {
              type: "plain_text",
              text: "Select options",
              emoji: true,
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "*this is plain_text text*",
                  emoji: true,
                },
                value: "value-0",
              },
              {
                text: {
                  type: "plain_text",
                  text: "*this is plain_text text*",
                  emoji: true,
                },
                value: "value-1",
              },
              {
                text: {
                  type: "plain_text",
                  text: "*this is plain_text text*",
                  emoji: true,
                },
                value: "value-2",
              },
            ],
            action_id: "multi_static_select-action",
          },
        },
      ],
    },
  };
  return createMeetingView;
};

export default createMeetingView;
