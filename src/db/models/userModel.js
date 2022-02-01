import pkg from "mongoose";
const { model, Schema } = pkg;

const userSchema = new Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  scope: [{ type: String, required: true }],
  token_type: { type: String, required: true },
  expiry_date: { type: Number, required: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  isAuthenticated: { type: String, required: true },
});

userSchema.index({ user_id: 1, email: 1 }, { unique: true });

var users = model("users", userSchema);

export default users;
