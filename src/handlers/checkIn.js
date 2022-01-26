const checkIn = async ({ message, say }) => {
    console.log(message);
    await say(`Yes! I'm here <@${message.user}>!`);
};

export default checkIn;