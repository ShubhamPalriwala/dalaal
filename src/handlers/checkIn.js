const checkIn = async ({ message, say, client }) => {
  await say(`Hey there! I am alive <@${message.user}>!`);
};

export default checkIn;
