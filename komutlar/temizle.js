const db = require("quick.db");
const Discord = require("discord.js");







module.exports.run = async (client,message,args) => {
  const limit = args[0];
  if(isNaN(limit)) {
    return client.sendEmbed(message.channel,"Bir miktar girin.",true,message.author);
  }
  if(limit > 100 || limit < 1) return client.sendEmbed(message.channel,"Lütfen 1 ile 100 arasında bir miktar girin.",true,message.author);
  await message.channel.bulkDelete(limit);
  client.sendEmbed(message.channel,`${limit} adet mesaj başarıyla silindi.`,true,message.author,20000);
};







module.exports.help = {
  aliases:["sil"], // komut ismi dışında diğer alternatifler
  name:"temizle", // ismi
  permLevel:2, // 0 yetkisi yoksa bile kullanabilir
  description:"Belirtilen miktarda mesaj siler.", // açıklama
  usage:"<prefix>temizle 100", // nasıl kullanılacağını yaz
  enable:true, // kullanılabilir mi kullanılamaz mı
  category:"log" // komutun kategorisi
};