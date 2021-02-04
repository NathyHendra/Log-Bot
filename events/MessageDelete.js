const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");
const moment = require("moment");
moment.locale("tr")






module.exports = async (message) => {
  if(!message.author) return;
  if(message.author.id === message.client.user.id) return;
  const date = new Date();
    let logChannel = message.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const silinenMessageID = db.fetch(`reklamKorumaSilinenMesaj_${message.guild.id}`)
  const { client } = message;
  if(silinenMessageID === message.id && silinenMessageID) return db.delete(`reklamKorumaSilinenMesaj_${message.guild.id}`); 
  const embed = new Discord.MessageEmbed()
  .setAuthor(`Mesaj sahibi: ${message.author.username}`,message.author.avatarURL({ size:4096, dynamic:true }))
  .setDescription(`**${message.author} kişisinin ${message.channel} kanalındaki mesajı silindi.**`)
  .addField("Mesajın oluşturulma tarihi:",moment(message.createdAt).format("YYYY-MMMM-dddd hh:mm:ss"))
  .addField("Mesajın silinme tarihi:",moment(date).format("YYYY-MMMM-dddd hh:mm:ss"))
  .addField("İçerik:",`\`\`\`${message.content}\`\`\``) 
  .setFooter(`Mesaj ID: ${message.id}`);
  client.sendEmbed(logChannel,embed,false)
  
};