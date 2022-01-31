const createMeetingView = (trigger_id, slots) => {
  let options = [];
  console.log(slots);
  slots.forEach((slot) => {
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
          block_id: "b_meeting_slots",
          accessory: {
            type: "multi_static_select",
            placeholder: {
              type: "plain_text",
              text: "Select options",
              emoji: true,
            },
            options,
            action_id: "i_selected_slots",
          },
        },
        {
          type: "input",
          block_id: "b_meeting_title",
          element: {
            type: "plain_text_input",
            action_id: "i_meeting_title",
          },
          label: {
            type: "plain_text",
            text: "Meeting title",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "b_meeting_desc",
          element: {
            type: "plain_text_input",
            action_id: "i_meeting_desc",
          },
          label: {
            type: "plain_text",
            text: "Meeting describe",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: "b_meeting_team",
          element: {
            type: "plain_text_input",
            action_id: "i_meeting_team",
          },
          label: {
            type: "plain_text",
            text: "Meeting team",
            emoji: true,
          },
        },
      ],
    },
  };
  return createMeetingView;
};

export default createMeetingView;
