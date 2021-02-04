const Discord = require("discord.js");

const client = new Discord.Client({partials:["CHANNEL","MESSAGE","GUILD_MEMBER","USER","REACTION"]});

const { token } = require("./config.json");

const fs = require("fs");

const config = require("./config.json");

require("./eventLoader/Loader.js")(client);

const invites = {};

const wait = require("util").promisify(setTimeout);

client.commands = new Discord.Collection();

client.aliases = new Discord.Collection();

const db = require("quick.db");

const ms = require("ms");

const commandFiles = fs.readdirSync("./komutlar");

commandFiles.forEach((file) => {

  if(!file.endsWith(".js")) return;

  const command = require(`./komutlar/${file}`);

  if(!command.help) throw new Error(`${file} isimli dosyada komutun help bölümü belirtilmemiş.`);

  if(!command.run || typeof command.run !== "function") throw new Error(`${file} isimli dosyada komutu başlatıcak run bölümü bulunmamaktadır.`);

  if(!command.help.name) throw new Error(`${file} isimli dosyada komut ismi belirtilmemiş.`);

  if(!command.help.category) throw new Error(`${file} isimli dosyada komut kategorisi belirtilmemiş.`);

  if(!command.help.permLevel && isNaN(command.help.permLevel)) throw new Error(`${file} isimli dosyada komut yetki leveli belirtilmemiş.`);

  if(!command.help.description) throw new Error(`${file} isimli dosyada komut açıklaması belirtilmemiş.`);

  if(!command.help.usage) throw new Error(`${file} isimli dosyada komutun nasıl kullanılacağı belirtilmemiş.`);

  if(typeof command.help.enable !== "boolean") throw new Error(`${file} isimli dosyada enable bölümü true yada false değer alabilir.`);

  if(!Array.isArray(command.help.aliases)) command.help.aliases = [];

  client.commands.set(command.help.name,command);

  command.help.aliases.forEach((alias) => client.aliases.set(alias,command.help.name));

})

client.sendEmbed = async function (channel,content,deleted = false, user, timeout = 10000) {

  let embed ;

  if(content instanceof Discord.MessageEmbed) embed = content;

  else embed = new Discord.MessageEmbed()

  .setAuthor(user.username,user.displayAvatarURL({ size:4096, dynamic:true }))

  .setDescription(content);

  embed.setColor(config.embedColor)

  embed.setTimestamp()

  const sended = await channel.send(embed);

  if(deleted) sended.delete({ timeout });

  return sended;

}

client.login(token).catch(console.log);

