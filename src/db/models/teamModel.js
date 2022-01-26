import pkg from "mongoose";
const { model, Schema } = pkg;

const teamSchema = new Schema({
  orgName: { type: String, required: true },
  teamname: { type: String, required: true },
  users: [{ type: String, required: true }],
});

teamSchema.index({ orgName: 1, teamname: 1 }, { unique: true });

var teams = model("teams", teamSchema);

export default teams;
