const Discord = require("discord.js");
const config = require("../config.json");
const db = require("quick.db");
const moment = require("moment");
moment.locale("tr")






module.exports = async (oldMessage,newMessage) => {
  if(!oldMessage.author) return;
  if(oldMessage.author.bot) return;
  if(oldMessage.content === newMessage.content) return;
  const date = new Date();
    let logChannel = newMessage.guild.channels.cache.get(config.logKanal);
  if(!logChannel) return;
  const { client } = newMessage;
  const embed = new Discord.MessageEmbed()
  .setAuthor(`Mesaj sahibi: ${oldMessage.author.username}`,oldMessage.author.avatarURL({ size:4096, dynamic:true }))
  .setDescription(`**${oldMessage.author} kişisinin ${oldMessage.channel} kanalındaki mesajı düzenlendi.**`)
  .addField("Mesajın oluşturulma tarihi:",moment(oldMessage.createdAt).format("YYYY-MMMM-dddd hh:mm:ss"))
  .addField("Mesajın güncellenme tarihi:",moment(date).format("YYYY-MMMM-dddd hh:mm:ss"))
  .addField("Eski mesaj:",`\`\`\`${oldMessage.content}\`\`\``)
  .addField("Yeni mesaj:",`\`\`\`${newMessage.content}\`\`\``)
  .setFooter(`Mesaj ID: ${newMessage.id}`);
  client.sendEmbed(logChannel,embed,false)
}