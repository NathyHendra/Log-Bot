const db = require("quick.db");
const config = require("../config.json");
const Discord = require("discord.js");

module.exports.run = (client, message, args) => {
  const pxve = new Discord.MessageEmbed()

      .setAuthor(
        "Serendia Squad",
        "https://cdn.discordapp.com/attachments/777057925356322827/806689343447498762/bilinmeyen.gif"
      )
      .setColor("#00FF0B")
      .setDescription(
        `Türkiye'nin En Büyük ve En Kaliteli Topluluk & Kod Yardım - Kod Paylaşım Sunucusu!\n\n[Sunucu Linki](https://discord.gg/serendia) | [Github](https://github.com/Pxve)`
      )
      .setFooter("Pxve ~ Serendia Squad")
   message.channel.send(`<@${message.author.id}> Bu Bot Serendia Squad Sunucusunda istek üzerine paylaşılmıştır.Aramıza Katıl!`, pxve);
};

module.exports.help = {
  aliases: ["help", "yardım", "Log"], // komut ismi dışında diğer alternatifler
  name: "serendia", // ismi
  permLevel: 0, // 0 yetkisi yoksa bile kullanabilir
  description: "komutun açıklaması.", // açıklama
  usage: "serendia", // nasıl kullanılacağını yaz
  enable: true, // kullanılabilir mi kullanılamaz mı
  category: "serendia" // komutun kategorisi
};
