import teamUpView from "../views/teamUpView.js";
import teams from "../db/models/teamModel.js";

const teamUp = async ({ ack, body, client, logger }) => {
  await ack();
  try {
    const result = await client.views.open(teamUpView(body.trigger_id));
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};

const createTeamCallBack = async ({ ack, body, view, client, logger }) => {
  await ack();
  const name = view["state"]["values"]["b_team_name"]["i_team_name"].value;
  const users = view["state"]["values"]["b_users"]["i_users"]["selected_users"];

  const user_who_created = body["user"]["id"];

  try {
    await teams.create({ teamname: name, users });
    await client.chat.postMessage({
      channel: user_who_created,
      text: "Team " + name + " has been succesfully created!",
    });
  } catch (error) {
    console.log(error);
  }
};

export { teamUp, createTeamCallBack };
