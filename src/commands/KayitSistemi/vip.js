const { MessageEmbed } = require('discord.js');
const ayar = require("../../configs/sunucuayar.json")
const Ayarlar = require("../../configs/sunucuayar.json");
const { red , green } = require("../../configs/emojis.json")
const isimler = require("../../schemas/names");
const moment = require("moment")
moment.locale("tr")


module.exports = {
  conf: {
    aliases: ["v", "vip"],
    name: "vip",
    help: "vip <@aspect/ID>",
    category: "kayıt",
  },

  run: async (client, message, args, perm, prefix) => {
  

  
       let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       if(!Ayarlar.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !Ayarlar.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content:`Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
  
    if (!member) return message.channel.send(`${message.member}, Geçerli bir üye belirtmelisin. ${red}`)
    if (member.id === message.author.id) return message.channel.send(`${message.member}, Kendine vip veremezsin! ${red}`)
    if (member.user.bot) return message.channel.send(`${message.member}, belirttiğin üye bir bot olamaz! ${red}`)
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(`${message.member}, Belirttiğin üye senden üst/aynı pozisyonda! ${red}`)
   
    if (member.roles.cache.has(ayar.vipRole)) {
        await member.roles.remove(ayar.vipRole).catch(err => {});
        message.channel.send(`${member}, üyesinden **VİP** rolü alındı. ${green}`)

    } else {

        await member.roles.add(ayar.vipRole).catch(err => {});
        message.channel.send(`${member}, üyesine **VİP** rolü verildi. ${green}`)
    }
   
    
  }
}