import pkg from 'mongoose';
const { model, Schema } = pkg;

var teams = model('teams', new Schema({
    teamname: { type: String, required: true },
    users: [{ type: String, required: true }],
}));

export default teams;