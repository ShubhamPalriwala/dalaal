const checkIn = async ({ message, say, client }) => {
  console.log(message.user);
  const res = await client.users.profile.get({ user: message.user })
  console.log(res);
  await say(`Yes! I'm here <@${message.user}>!`);
};

export default checkIn;
