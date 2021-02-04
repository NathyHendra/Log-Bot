const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");
const { Perms } = require("../util/permissions.js");
const moment = require("moment");
moment.locale("tr")





module.exports = async (oldRole,newRole) => {
  const date = new Date();
    let logChannel = newRole.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const { client } = newRole;
  const fetchLogs = await newRole.guild.fetchAuditLogs({limit:1,type:"ROLE_UPDATE"});
  const auditEntry = fetchLogs.entries.first();
  const executor = auditEntry ? auditEntry.executor.username : "Bulunamadı."
  const avatarURL = auditEntry ? auditEntry.executor.avatarURL({ size:4096, dynamic:true }) : null; 
  let struc = [];
  if(oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
    const oldPermissions = oldRole.permissions.toArray();
    const newPermissions = newRole.permissions.toArray();
    let important = oldPermissions.length < newPermissions.length ? 2 : 1;
    let allNewPerms = getChangedItems(oldPermissions,newPermissions,important)
    const embed = createEmbedClass()
    .addField("Önceden:",`\`\`\`${allNewPerms.map((perm) => Perms[perm]).join(" - ")} ${important === 2 ? "Yetkileri yoktu." : "Yetkileri vardı."}\`\`\``)
    .addField("Şuan:",`\`\`\`${allNewPerms.map((perm) => Perms[perm]).join(" - ")} ${important === 2 ? "Yetkileri var." : "Yetkileri yok."}\`\`\``);
    struc.push(embed);
  }
  if(oldRole.hexColor !== newRole.hexColor) {
    const embed = createEmbedClass()
    .addField("Eski renk: ",oldRole.hexColor)
    .addField("Yeni renk:", newRole.hexColor);
    struc.push(embed);
  }
  if(oldRole.mentionable !== newRole.mentionable) {
    const embed = createEmbedClass()
    .addField("Etiketlenebilirlik durumu:", oldRole.mentionable ? "Etiketlenebilir" : "Etiketlenemez")
    .addField("Etiketlenebilirlik durumu:",newRole.mentionable ? "Etiketlenebilir" : "Etiketlenemez");
    struc.push(embed);
  }
  if(oldRole.hoist !== newRole.hoist) {
    const embed = createEmbedClass()
    .addField("Üyelerden ayrı gösterme durumu:",oldRole.hoist ? "Üyelerden ayrı gösteriliyor." : "Üyelerden ayrı gösterilmiyor.")
    .addField("Üyelerden ayrı gösterme durumu:",newRole.hoist ? "Üyelerden ayrı gösteriliyor." : "Üyelerden ayrı gösterilmiyor.");
    struc.push(embed);
  }
  if(oldRole.rawPosition !== newRole.rawPosition) {
    const embed = createEmbedClass()
    .addField("Eski pozisyonu:",`${oldRole.rawPosition} sırada`)
    .addField("Yeni pozisyonu:",`${newRole.rawPosition} sırada`);
    struc.push(embed);
  }
  if(oldRole.name !== newRole.namme) {
    const embed = createEmbedClass()
    .addField("Eski isim:",oldRole.name)
    .addField("Yeni isim:",newRole.name);
    struc.push(embed);
  }
  const allFields = struc.map((embed) => embed.fields);
  const embed = new Discord.MessageEmbed()
  .setTimestamp()
  .setAuthor(executor,avatarURL)
  .setDescription(`${newRole} Rolü güncellendi.`);
  embed.fields = [...allFields];
  embed.addField("Güncellenme tarihi:",moment(Date.now()).format("YYYY-MMMM-dddd hh:mm:ss"));
  client.sendEmbed(logChannel,embed,false);
};
  
  

  
  
function createEmbedClass() {
  return new Discord.MessageEmbed()
}




function getChangedItems(arr1,arr2,important) {
  if(important === 1) {
  return arr1.filter((item) => !arr2.includes(item));
  }else {
    return arr2.filter((item) => !arr1.includes(item));
  }
}