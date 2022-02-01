const checkInHanlder = async ({ message, say }) => {
  await say(`Hey there! I am alive <@${message.user}>!`);
};

export default checkInHanlder;
