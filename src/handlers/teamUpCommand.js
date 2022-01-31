import teamUpView from "../views/teamUpView.js";
import teams from "../db/models/teamModel.js";

const teamUp = async ({ ack, body, client, logger }) => {
  await ack();
  try {
    await client.views.open(teamUpView(body.trigger_id));
  } catch (error) {
    logger.error(error);
  }
};

const createTeamCallBack = async ({ ack, body, view, client, logger }) => {
  await ack();
  const name = view["state"]["values"]["b_team_name"]["i_team_name"].value;
  const users = view["state"]["values"]["b_users"]["i_users"]["selected_users"];

  const userWhoCreated = body["user"]["id"];
  const teamName = body["team"]["domain"];

  try {
    await teams.create({ orgName: teamName, teamname: name, users });
    await client.chat.postMessage({
      channel: userWhoCreated,
      text: "Team " + name + " has been succesfully created!",
    });
  } catch (error) {
    let errMessage =
      "Something went wrong for the team:" + name + ". Please try again.";

    if (error.name === "MongoServerError" && error.code === 11000) {
      errMessage =
        "A Team with the name " + name + " already exists in your workplace.";
    }
    await client.chat.postMessage({
      channel: userWhoCreated,
      text: errMessage,
    });
    logger(error);
  }
};

export { teamUp, createTeamCallBack };
