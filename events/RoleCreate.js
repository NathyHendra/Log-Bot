const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");
const { Perms } = require("../util/permissions.js");
const moment = require("moment");
moment.locale("tr")





module.exports = async (role) => {
  const date = new Date();
    let logChannel = role.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const { client } = role;
  const fetchLogs = await role.guild.fetchAuditLogs({limit:1,type:"ROLE_CREATE"});
  const auditEntry = fetchLogs.entries.first();
  const executor = auditEntry ? auditEntry.executor.username : "Bulunamadı."
  const avatarURL = auditEntry ? auditEntry.executor.avatarURL({ size:4096, dynamic:true }) : null; 
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${executor} kişisi rol oluşturdu.`,avatarURL)
  .addField("Rol ismi:",role.name)
  .addField("Yetkisi:",`\`\`\`${role.permissions.toArray().map((perm) => Perms[perm]).join(" - ")}\`\`\``)
  .addField("Rengi:",role.hexColor)
  .addField("Oluşturulma zamanı:",moment(role.createdAt).format("YYYY-MMMM-dddd hh:mm:ss"));
  client.sendEmbed(logChannel,embed,false);
};