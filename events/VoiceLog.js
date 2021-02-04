const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");
const moment = require("moment");
moment.locale("tr")






module.exports = async (oldState,newState) => {
  if(!oldState.guild || !newState.guild) return;
  const date = new Date();
  let seslogChannel = newState.guild.channels.cache.get(config.sesLogKanal);
  if(!seslogChannel) return;
  const { client } = newState;
  let joinedMemberOrLeavedMember;
  let struc = [];
  let channel;
  let state;
  if(!oldState.channel) {
    const embed = createEmbedClass()
    .addField(`Sesliye katılma tarihi:`,moment(date).format("YYYY-MMMM-dddd hh:mm:ss"));
    struc.push(embed);
    joinedMemberOrLeavedMember = newState.member;
    channel = newState.channel;
    state = "Ses kanalına katıldı.";
    db.set(`joinVoiceChannel_${newState.guild.id + newState.member.id}`,Date.now());
  }else if(!newState.channel) {
    const embed = createEmbedClass()
    .addField(`Sesliden ayrılma tarihi:`,moment(date).format("YYYY-MMMM-dddd hh:mm:ss"));
    struc.push(embed);
    joinedMemberOrLeavedMember = oldState.member;
    channel = oldState.channel;
    state = "Ses kanalından ayrıldı.";
  }
  const embed = new Discord.MessageEmbed();
  if(joinedMemberOrLeavedMember) {
    embed.addField("Kanal ID:",channel.id);
    if(state === "Kanalından ayrıldı.") {
      const joinedAt = db.fetch(`joinVoiceChannel_${oldState.guild.id + oldState.member.id}`);
      embed.addField("Kanala katılma tarihi:",moment(joinedAt).format("YYYY-MMMM-dddd hh:mm:ss"))
      .addField("Ayrılma tarihi:",moment(date).format("YYYY-MMMM-dddd hh:mm:ss"));
      db.delete(`joinVoiceChannel_${oldState.guild.id + oldState.member.id}`);
    }
    embed.setDescription(`${channel} ${state}`)
    embed.setAuthor(joinedMemberOrLeavedMember.user.username,joinedMemberOrLeavedMember.user.avatarURL({ size:4096, dynamic:true }))
    return client.sendEmbed(seslogChannel,embed,false);
  }
  embed.setAuthor(`${newState.member.user.username}'in ses durumu`,newState.member.user.avatarURL({ size:4096, dynamic:true }));
  if(oldState.selfMute !== newState.selfMute) {
    embed.addField("Eski -> susturulma durumu:",oldState.selfMute ? "Susturulmuş" : "Susturulmamış")
    .addField("Yeni -> susturulma durumu:",newState.selfMute ? "Susturulmuş" : "Susturulmamış");
    client.sendEmbed(seslogChannel,embed,false);
    return
  }
  if(oldState.selfDeaf !== newState.selfDeaf) {
    embed.addField("Eski -> sağırlaştırılma durumu:",oldState.selfDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış")
    .addField("Yeni -> sağırlaştırılma durumu:",newState.selfDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış");
    client.sendEmbed(seslogChannel,embed,false);
    return;
  }
  if(oldState.serverMute !== newState.serverMute) {
    const fetchLogs = await newState.guild.fetchAuditLogs({limit:1});
    const auditEntry = fetchLogs.entries.first();
    const executor = auditEntry ? auditEntry.executor.username : "Bulunamadı."
    const avatarURL = auditEntry ? auditEntry.executor.avatarURL({ size:4096, dynamic:true }) : null; 
    embed.setAuthor(`${executor} Tarafından`,avatarURL);
    embed.addField("Eski -> sunucuda susturulma durumu:",oldState.serverMute ? "Susturulmuş" : "Susturulmamış")
    .addField("Yeni -> sunucuda susturulma durumu:",newState.serverMute ? "Susturulmuş" : "Susturulmamış");
    client.sendEmbed(seslogChannel,embed,false);
    return
  }
  if(oldState.serverDeaf !== newState.serverDeaf) {
    const fetchLogs = await newState.guild.fetchAuditLogs({limit:1});
    const auditEntry = fetchLogs.entries.first();
    const executor = auditEntry ? auditEntry.executor.username : "Bulunamadı."
    const avatarURL = auditEntry ? auditEntry.executor.avatarURL({ size:4096, dynamic:true }) : null; 
    embed.setAuthor(`${executor} Tarafından`,avatarURL);
    embed.addField("Eski -> sunucuda sağırlaştırılma durumu:",oldState.serverDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış")
    .addField("Yeni -> sunucuda sağırlaştırılma durumu:",newState.serverDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış");
    client.sendEmbed(seslogChannel,embed,false);
    return;
  }
  if((oldState.channelID && newState.channelID) && oldState.channelID !== newState.channelID) {
    const avatarURL = newState.member.user.avatarURL({ size:4096, dynamic:true });
    embed.setAuthor(`${newState.member.user.username} Ses durumu`,avatarURL);
    embed.addField("Eski -> ses kanalı:",oldState.channel)
    .addField("Yeni -> ses kanalı:",newState.channel);
    client.sendEmbed(seslogChannel,embed,false);
    return
  
  }
};




   
function createEmbedClass() {
  return new Discord.MessageEmbed()
}