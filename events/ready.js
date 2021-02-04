






const messages = ["Pxve Log"]

module.exports = (client) => {
  console.log(`Bot ${client.user.tag} hazır. [Serendia Squad ~ Pxve Log Bot]`);
  
  client.user.setPresence({
      activity: {
        name: messages[0],
        type:"WATCHING"
      }
    });
};