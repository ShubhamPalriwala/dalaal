import { givePreferredSlot } from "./givePreferredSlot.js";

const checkIn = async ({ message, say, client }) => {
  console.log(message.user);
  await say(`Yes! I'm here <@${message.user}>!`);
};

export default checkIn;
