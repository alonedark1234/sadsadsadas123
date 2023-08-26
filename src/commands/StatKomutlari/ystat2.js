
const regstats = require("../../schemas/registerStats");
const conf = require("../../configs/sunucuayar.json");
const inviteMemberSchema = require("../../schemas/inviteMember");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const voiceUserParent = require("../../schemas/voiceUserParent");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const cezapuan = require("../../schemas/cezapuan");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const yetkis = require("../../schemas/yetkis");
const ceza = require("../../schemas/ceza");
const toplams = require("../../schemas/toplams");
const inviterSchema = require("../../schemas/inviter");
const { xp, gulucuk, mesaj2, altin, altin2 ,rewards, voice ,star , fill, empty, fillStart, emptyEnd, fillEnd, red, miniicon } = require("../../configs/emojis.json");
const { TeamMember, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const isimler = require("../../schemas/names");
const register = require("../../schemas/registerStats");
const moment = require("moment");
require("moment-duration-format");
const wait = require('node:timers/promises').setTimeout;
 
module.exports = {
  conf: {
    aliases: ["yy"],
    name: "me",
    category: "stat",
  },

  run: async (client, message, args, embed) => {
    if(!conf.staffs.some(rol => message.member.roles.cache.has(rol))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.staffs.some(rol => member.roles.cache.has(rol))) return message.react(red)
    
    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    
    const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
      };
      
      const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
      const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
      let messageTop;
      Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `${miniicon} <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."

      const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
      const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
      const messageWeekly = messageData ? messageData.weeklyStat : 0;
      const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
      const messageDaily = messageData ? messageData.dailyStat : 0;
      const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");

      if (member.user.bot) return;
  
      let nameData = await isimler.findOne({ guildID: message.guild.id, userID: member.id });
      let registerData = await register.findOne({ guildID: message.guild.id, userID: member.id });
    
               const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
                const rolleri = []
                if (roles.length > 6) {
                    const lent = roles.length - 6
                    let itemler = roles.slice(0, 6)
                    itemler.map(x => rolleri.push(x))
                    rolleri.push(`${lent} daha...`)
                } else {
                    roles.map(x => rolleri.push(x))
                }
                const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
                const joinPos = members.map((u) => u.id).indexOf(member.id);
                const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
                const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
                const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${member.id}>${next ? ` > **${next.tag}**` : ""}`
                let üye = message.guild.members.cache.get(member.id)
                let nickname = üye.displayName == member.username ? "" + member.username + " [Yok] " : member.displayName
    
    
   const invMember = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
    const günlük = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const haftalik = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    let tagges;

    
     const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

 

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] 
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });
 
      
     

      let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
      currentRank = currentRank[currentRank.length-1];

      const coinStatus = message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?
      `${currentRank ?`
      ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz. :)"}` : ` 
      Şuan ${message.member.roles.highest} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanmanız gerekiyor!`}` : ""
      
      
      var KategoriVeri = new MessageButton()
    .setLabel("Kategori Veri")
    .setCustomId("kategori_veri")
    .setStyle("DANGER")
    .setEmoji("943107807312482304")

    var SesChat = new MessageButton()
    .setLabel("Ses ve Chat Veri")
    .setCustomId("ses_chat")
    .setStyle("PRIMARY")
    .setEmoji("943107807312482304")
    
    var İnvites = new MessageButton()
    .setLabel("İnvite ve Kayıt Veri")
    .setCustomId("invite_sayim")
    .setStyle("SUCCESS")
    .setEmoji("943107807312482304")
    
    var Iptal = new MessageButton()
    .setLabel("Puanlama")
    .setCustomId("iptal_button")
    .setStyle("SECONDARY")
    .setEmoji("943107807312482304")

const row = new MessageActionRow()
.addComponents(SesChat, İnvites, Iptal)

embed.setDescription(`
<a:bit:1143530581771169832> Merhaba ${message.guild.name} sunucusundaki istatistikleriniz hakkında bilgi almak için aşağıdaki bilgilendirmeyi okuyunuz.

\`•\` Ses ve Chat Kanalları Sıralaması için: \`MAVİ BUTON 🔵\`
\`•\` Davet ve Kayıt Bilgileriniz için: \`YEŞİL BUTON 🟢\`
\`•\` Tüm İstatistik Verilerini Görüntülemek için: \`GRİ BUTON ⚫\`
`)


   

    let msg = await message.channel.send({ embeds: [embed], components: [row] });

     var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

    collector.on("collect", async (button) => {
      
      if(button.customId === "kategori_veri") {
        await button.deferUpdate();

      const puan = new MessageEmbed()
.setDescription(`
<a:bit:1143530581771169832> ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda **Kategori** bilgileri aşağıda belirtilmiştir.
`) 
      
       .addField(`${voice} **Sesli Sohbet İstatistiği**`, `
${miniicon} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${miniicon} Public Odalar: \` ${await category(conf.publicParents)} \`
${miniicon} Secret Odalar: \` ${await category(conf.privateParents)} \`
${miniicon} Alone Odalar: \` ${await category(conf.aloneParents)} \`
${miniicon} Yönetim Yetkili Odaları: \` ${await category(conf.funParents)} \`
${miniicon} Kayıt Odaları: \` ${await category(conf.registerParents)} \``)

msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }


   if(button.customId === "ses_chat") {
        await button.deferUpdate();

      const puan = new MessageEmbed()
.setDescription(`
<a:bit:1143530581771169832> ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda **Ses ve Chat** bilgileri aşağıda belirtilmiştir.
      `) 
.addField(`
${voice} **Sesli İstatistiği**`, `

${miniicon} Haftalık Ses Aktifliği: \` ${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")} \`
${miniicon} Günlük Ses Aktifliği: \` ${moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]")} \`
`, false)
.addField(`
${mesaj2} **Yazı İstatistiği**`, `

${miniicon} Haftalık Atılan Mesaj: \` ${Number(messageWeekly).toLocaleString()} mesaj \`
${miniicon} Günlük Atılan Mesaj: \` ${Number(messageDaily).toLocaleString()} mesaj \`
`)
    
       .addField(`${voice} **Sesli Sohbet İstatistiği**`, `
${miniicon} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${miniicon} Public Odalar: \` ${await category(conf.publicParents)} \`
${miniicon} Secret Odalar: \` ${await category(conf.privateParents)} \`
${miniicon} Alone Odalar: \` ${await category(conf.aloneParents)} \`
${miniicon} Yönetim Yetkili Odaları: \` ${await category(conf.funParents)} \`
${miniicon} Kayıt Odaları: \` ${await category(conf.registerParents)} \``)
      
      .addField(`${mesaj2} **Mesaj İstatistiği**`, `
${miniicon} Toplam: ${messageData ? messageData.topStat : 0} \`mesaj\`
${messageTop}
`)
 
msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }

   if(button.customId === "invite_sayim") {
        await button.deferUpdate();
const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
      const puan = new MessageEmbed()
.setDescription(`
<a:bit:1143530581771169832> ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda **Davet ve Kayıt** bilgileri aşağıda belirtilmiştir.
      `) 
        .addField(`${star} **Davet Detay**`, `
Toplam: **${total}**
> Gerçek: **${regular}** 
> Bonus: **${bonus}** 
> Ayrılmış: **${leave}** 
> Fake: **${fake}** `, false)
      
    
       .addField(`${star} **Kayıt Detay**`, `
Toplam kayıt bilgisi: **${data ? data.top : 0}**
> Toplam erkek kayıt bilgisi: **${data ? data.erkek : 0}**
> Toplam kız kayıt bilgisi: **${data ? data.kız : 0}**`, false)
      
   
msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }

   if(button.customId === "iptal_button") {
        await button.deferUpdate();
     const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
      const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] 
      const puan = new MessageEmbed()
.setDescription(`
<a:bit:1143530581771169832> ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda **Puanlama** bilgileri aşağıda belirtilmiştir.
      `) 
    
       .addField(`${star} **__Net Puanlama Bilgisi__**`, `
${miniicon} Kayıt işlemi yaparak, \`+5.5\` puan kazanırsın.
${miniicon} Taglı üye belirleyerek, \`+20\` puan kazanırsınız.
${miniicon} İnsanları davet ederek, \`+10\` puan kazanırsın.
${miniicon} İnsanları yetkili yaparak, \`+30\` puan kazanırsın.
${miniicon} Seste kalarak, ortalama olarak \`+1\` puan kazanırsınız.
${miniicon} Yazı yazarak, ortalama olarak, \`+1\` puan kazanırsınız.
 `, false)
      .addField(`${star} **__Puan Detayları__**`, `
${miniicon} Kayıt: (\`Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0}\`)
${miniicon} Davet: (\`Puan Etkisi: +${total*10}\`)
${miniicon} Yetkili: (\`Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0}\`)
${miniicon} Toplam Ses: (\`Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat*1 : 0).format("m")}\`)
${miniicon} Toplam Mesaj: (\`Puan Etkisi: +${messageData ? messageData.topStat*1 : 0}\`)
${miniicon} Toplam Aldığın Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (\`Toplam ${cezaData ? cezaData.ceza.length : 0}\`)
 `, false)

.addField(`${star} **Puan Durumu:**`, `
Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
 `, false)

      
    .addField(`${star} **Yetki Durumu:**`, `
      ${coinStatus}
       `, false);  
msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }


  })
  }
};

function progressBar(value, maxValue, size) {
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;

const progressText = fill.repeat(progress);
const emptyProgressText = empty.repeat(emptyProgress);

return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
};
