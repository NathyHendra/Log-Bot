const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");
const moment = require("moment");
moment.locale("tr")



module.exports = async (oldMember,newMember) => {
  const date = new Date();
    let logChannel = newMember.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const { client } = newMember;
  let struc = [];
  const avatarURL = newMember.user.avatarURL({ size:4096, dynamic:true });
  const userName = newMember.user.username
  if(oldMember.nickname !== newMember.nickname) {
    const embed = createEmbedClass()
    .addField("Eski isim:",oldMember.nickname ? oldMember.nickname : oldMember.user.username)
    .addField("Yeni isim:",newMember.nickname ? newMember.nickname : newMember.user.username)
    .setTimestamp()
    .setAuthor(`${userName}'nin ismi düzenlendi`,avatarURL)
    .setThumbnail(avatarURL);
    return client.sendEmbed(logChannel,embed,false)
  }
  if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
    const muteData = db.fetch(`mutedMember_${newMember.guild.id + newMember.id}`);
    const muteRole = db.fetch(`muteRole_${newMember.guild.id}`);
    if(muteData) {
      if(!newMember.roles.cache.has(muteRole)) {
        db.delete(`mutedMember_${newMember.guild.id + newMember.id}`);
      }
    }
    const jailData = db.fetch(`jailedMember_${newMember.guild.id + newMember.id}`);
    const jailRole = db.fetch(`jailRole_${newMember.guild.id}`);
    if(jailData) {
      if(!newMember.roles.cache.has(jailRole)) {
        db.delete(`jailedMember_${newMember.guild.id + newMember.id}`);
      }
    }
    const oldRoles = oldMember.roles.cache.array();
    const newRoles = newMember.roles.cache.array();
    let important = oldRoles.length < newRoles.length ? 2 : 1;
    const changedRoles = getChangedItems(oldRoles,newRoles,important); 
    const embed = createEmbedClass()
    .setAuthor(`${userName}'nin rolleri güncellendi.`,avatarURL)
    .addField("Önceden:",`${changedRoles.join(" - ")} ${important === 2 ? "Rolleri yoktu." : "Rolleri vardı."}`)
    .addField("Şuan:",`${changedRoles.join(" - ")} ${important === 2 ? "Rolleri var." : "Rolleri yok."}`)
    .setThumbnail(avatarURL);
    return client.sendEmbed(logChannel,embed,false);
  }
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