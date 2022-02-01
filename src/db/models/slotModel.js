import pkg from "mongoose";
const { model, Schema, Types } = pkg;

var slots = model(
    "slots",
    new Schema({
        meetingId: { type: Types.ObjectId, ref: "meetings", required: true },
        userId: { type: String, required: true },
        timing: { type: Object, required: true },
    })
);

export default slots;
