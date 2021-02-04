const req = file => require(`../events/${file}`);

module.exports = client => {
  client.on("message", req("message"));

  client.on("ready", () => req("ready")(client));

  client.on("guildMemberAdd", req("GuildMemberAdd.js"));

  client.on("guildMemberRemove", req("GuildMemberLeave.js"));
  client.on("channelUpdate", req("ChannelUpdate.js"));

  client.on("messageDelete", req("MessageDelete.js"));

  client.on("messageUpdate", req("MessageUpdate.js"));

  client.on("roleCreate", req("RoleCreate.js"));

  client.on("roleDelete", req("RoleDelete.js"));

  client.on("roleUpdate", req("RoleUpdate.js"));

  client.on("channelCreate", req("ChannelCreate.js"));

  client.on("channelDelete", req("ChannelDelete.js"));

  client.on("channelUpdate", req("ChannelUpdate.js"));

  client.on("voiceStateUpdate", req("VoiceLog.js"));

  client.on("guildMemberUpdate", req("MemberUpdate.js"));

};
