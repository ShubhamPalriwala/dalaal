const checkIn = async ({ message, say }) => {
  await say(`Yes! I'm here <@${message.user}>!`);
};

export default checkIn;
