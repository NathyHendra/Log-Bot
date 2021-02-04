const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../config.json");
const { Perms } = require("../util/permissions.js");
const moment = require("moment");
moment.locale("tr")





module.exports = async (channel) => {
  const date = new Date();
    let logChannel = channel.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const { client } = channel;
  const type = {
    voice:"Ses",
    text:"Yazışma",
    category:"Kategori"
  };
  const fetchLogs = await channel.guild.fetchAuditLogs({limit:1,type:"CHANNEL_DELETE"});
  const auditEntry = fetchLogs.entries.first();
  const executor = auditEntry ? auditEntry.executor.username : "Bulunamadı."
  const avatarURL = auditEntry ? auditEntry.executor.avatarURL({ size:4096, dynamic:true }) : null; 
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${executor} kişisi kanal sildi.`,avatarURL)
  .addField("Kanal ismi:",channel.name)
  .addField("Kanal tipi:",type[channel.type])
  .addField("Kategorisi:",channel.parent ? channel.parent : "Yok")
  .addField("Oluşturulma zamanı:",moment(channel.createdAt).format("YYYY-MMMM-dddd hh:mm:ss"))
  .addField("Silinme zamanı:",moment(Date.now()).format("YYYY-MMMM-dddd hh:mm:ss"));
  client.sendEmbed(logChannel,embed,false);
};