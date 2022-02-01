import pkg from "mongoose";
const { model, Schema, Types } = pkg;

var meetings = model(
  "meetings",
  new Schema({
    workspace: { type: String, required: true },
    title: { type: String, required: true },
    description: [{ type: String, required: false }],
    preferableSlots: { type: Array, required: true },
    start: { type: Number, required: false },
    end: { type: Number, required: false },
    timing: { type: Object, required: false },
    host: { type: String, required: true },
    teamId: {
      type: Types.ObjectId,
      ref: "teams",
      // required: true
    },
    invitees: { type: Array, required: false },
    countOfAttendees: { type: Number, required: true, default: 0 },
  })
);

export default meetings;
