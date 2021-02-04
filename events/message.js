const db = require("quick.db");
const config = require("../config.json");
const Discord = require("discord.js");






module.exports = async (message) => {
  if(message.author.bot) return;
  if(!message.guild) return;
  const prefix = db.fetch(`prefix_${message.guild.id}`) || config.prefix;
 const { client } = message;
 if(!message.content.startsWith(prefix)) return;
  const commandName = message.content.slice(prefix.length).split(" ")[0];
  const args = message.content.split(" ").slice(1);
  let cmd;
  if(client.commands.has(commandName)) cmd = client.commands.get(commandName);
  if(client.aliases.has(commandName)) cmd = client.commands.get(client.aliases.get(commandName));
  if(cmd) {
    if(!cmd.help.enable) return;
    if(cmd.help.permLevel === 8) {
      if(!config.sahipler.includes(message.author.id)) return message.channel.send("**Bu komut botun sahiplerine özeldir**");
    }else if(cmd.help.permLevel === 1 && !config.sahipler.includes(message.author.id)) {
        if(!message.member.hasPermission("MANAGE_GUILD")) {
          sendWarnMessage(message,"**Bu komut için __Sunucuyu Yönet__ yetkisine sahip olmalısın.**");
          return
        }
    }else if(cmd.help.permLevel === 2 && !config.sahipler.includes(message.author.id)) {
      if(!message.member.hasPermission("ADMINISTRATOR")) {
        sendWarnMessage(message,"**Bu komut için __Yönetici__ yetkisine sahip olmalısın.**")
        return;
        }
    }else if(cmd.help.permLevel === 3 && !config.sahipler.includes(message.author.id)) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
          sendWarnMessage(message,"**Bu komut için __Mesajları yönet__ yetkisine sahip olmalısın.**");
          return
        }
    }
    cmd.run(client,message,args);
  }else {
    if(!commandName) return;
    const startsWith = client.commands.keyArray().filter((command) => command.startsWith(commandName));
    if(startsWith.length === 0) return;
  }
};




function sendWarnMessage(message,content) {
  const embed = new Discord.MessageEmbed()
          .setAuthor(message.member.displayName,message.author.avatarURL({ size:4096, dynamic:true }))
          .setColor(config.embedColor)
          .setDescription(content)
          .setTimestamp()
          .setFooter(`Bizi tercih ettiğiniz için teşekkürler.`)
  message.channel.send(embed);
  return;        
}