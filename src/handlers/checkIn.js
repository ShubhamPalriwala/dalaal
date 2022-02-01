import { givePreferredSlot } from "./givePreferredSlot.js";

const checkIn = async ({ message, say, client }) => {
    // await givePreferredSlot(
    //     { start: "1100", end: "2100" },
    //     "U02ULGJKWJ2",
    //     "61f97ae037ccf0cad58cea1a"
    // );
    await say(`Yes! I'm here <@${message.user}>!`);
};

export default checkIn;
