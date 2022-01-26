const teamUp = (trigger_id) => {
  const teamUpView = {
    trigger_id,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "My App",
        emoji: true,
      },
      callback_id: "create_team",
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
            text: "Add your Dalaal gang.",
          },
        },
        {
          type: "input",
          block_id: "b_team_name",
          element: {
            type: "plain_text_input",
            action_id: "i_team_name",
          },
          label: {
            type: "plain_text",
            text: "Team name",
            emoji: false,
          },
        },
        {
          type: "input",
          block_id: "b_users",
          element: {
            type: "multi_users_select",
            placeholder: {
              type: "plain_text",
              text: "Select users",
              emoji: true,
            },
            action_id: "i_users",
          },
          label: {
            type: "plain_text",
            text: "Team members",
            emoji: true,
          },
        },
      ],
    },
  };
  return teamUpView;
};

export default teamUp;
