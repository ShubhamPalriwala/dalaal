import pkg from "mongoose";
const { model, Schema } = pkg;

var meetings = model(
  "meetings",
  new Schema({
    workspace: { type: String, required: true },
    title: { type: String, required: true },
    description: [{ type: String, required: false }],
    preferableSlots: { type: Array, required: true },
    timing: { type: Object, required: false },
    host: { type: String, required: true },
    // TODO: change to reference of id
    teamId: { type: String, required: true },
  })
);

export default meetings;
