const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../config.json")
const { Perms } = require("../util/permissions.js");
const moment = require("moment");
moment.locale("tr")
const ms = require("ms");




module.exports = async (oldChannel,newChannel) => {
  const date = new Date();
    let logChannel = newChannel.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const { client } = newChannel;
  const fetchLogs = await newChannel.guild.fetchAuditLogs({limit:1,type:"CHANNEL_UPDATE"});
  const auditEntry = fetchLogs.entries.find((entry) => entry.target.id === newChannel.id);
  const executor = auditEntry ? auditEntry.executor.username : "Bulunamayan kişi"
  const avatarURL = auditEntry ? auditEntry.executor.avatarURL({ size:4096, dynamic:true }) : null; 
  let struc = [];
  if(oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
    const oldToMs = parseMs(ms(ms(`${oldChannel.rateLimitPerUser}s`)));
    const newToMs = parseMs(ms(ms(`${newChannel.rateLimitPerUser}s`)));
    const embed = createEmbedClass()
    .addField("Eski yavaş mod bekleme süresi:",oldToMs.startsWith("0") ? "Yok" : oldToMs)
    .addField("Yeni yavaş mod bekleme süresi:",newToMs.startsWith("0") ? "Yok" : newToMs);
    struc.push(embed);
  }
  if(oldChannel.name !== newChannel.name) {
    const embed = createEmbedClass()
    .addField("Eski isim:",oldChannel.name)
    .addField("Yeni isim:",newChannel.name);
    struc.push(embed);
  }
  if(oldChannel.nsfw !== newChannel.nsfw) {
    const embed = createEmbedClass()
    .addField("Nsfw durumu:",oldChannel.nsfw ? "Açık" : "Kapalı")
    .addField("Nsfw durumu:",newChannel.nsfw ? "Açık" : "Kapalı");
    struc.push(embed);
  }
  if(oldChannel.topic !== newChannel.topic) {
    const embed = createEmbedClass()
    .addField("Eski kanal başlığı:",oldChannel.topic ? oldChannel.topic : "Boş")
    .addField("Yeni kanal başlığı:",newChannel.topic ? newChannel.topic : "Boş");
    struc.push(embed);
  }
  if(oldChannel.rawPosition !== newChannel.rawPosition) {
    const embed = createEmbedClass()
    .addField("Eski Pozisyonu:",`${oldChannel.rawPosition} sırada`)
    .addField("Yeni Pozisyonu:",`${newChannel.rawPosition} sırada`)
    .addField("Kategorisi:",newChannel.parent ? newChannel.parent : "Yok");
    struc.push(embed);
  }
  if(oldChannel.userLimit !== newChannel.userLimit) {
    const embed = createEmbedClass()
    .addField("Eski üye limiti:",oldChannel.userLimit > 0 ? oldChannel.userLimit : "Limit yok")
    .addField("Yeni üye limiti:",newChannel.userLimit > 0 ? newChannel.userLimit : "Limit yok");
    struc.push(embed)
  }
  if(oldChannel.bitrate !== newChannel.bitrate) {
    const embed = createEmbedClass()
    .addField("Eski bitrate:",oldChannel.bitrate)
    .addField("Yeni bitrate:",newChannel.bitrate);
    struc.push(embed)
  }
  let memberOrRole;
  const oldChannelPermissionsUserOrRoleID = oldChannel.permissionOverwrites.map((item) => item.id);
  const newChannelPermissionsUserOrRoleID = newChannel.permissionOverwrites.map((item) => item.id);
  oldChannelPermissionsUserOrRoleID.forEach((id) => {
    const _memberOrRole = newChannel.guild.roles.cache.get(id) || newChannel.guild.members.cache.get(id);
    if(_memberOrRole) {
      let oldPerms = oldChannel.permissionsFor(_memberOrRole);
      let newPerms = newChannel.permissionsFor(_memberOrRole);
      if(oldPerms.bitfield !== newPerms.bitfield) {
        oldPerms = oldPerms.toArray();
        newPerms = newPerms.toArray();
        let important = oldPerms.length < newPerms.length ? 2 : 1;
        let allNewPerms = getChangedItems(oldPerms,newPerms,important);
        memberOrRole = _memberOrRole
        const embed = createEmbedClass()
        .addField("Önceden:",`\`\`\`${allNewPerms.map((perm) => Perms[perm]).join(" - ")} ${important === 2 ? "Yetkileri yoktu." : "Yetkileri vardı"}\`\`\``)
        .addField("Şuan:",`\`\`\`${allNewPerms.map((perm) => Perms[perm]).join(" - ")} ${important === 2 ? "Yetkileri var." : "Yetkileri yok"}\`\`\``);
        struc.push(embed);
      }
    }
  })
  if(struc.length === 0) return;
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${executor} ${newChannel.name} üzerinde değişiklikler yaptı`,avatarURL);
  memberOrRole ? embed.setDescription(`${memberOrRole}'in ${newChannel} üzerinde yetkileri değişti.`) : void 0;
  embed.fields = [...(struc.map((embed) => embed.fields))];
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



function parseMs(ms) {
  return ms
    .replace("m"," dakika")
    .replace("s"," saniye")
    .replace("h"," saat")
}


