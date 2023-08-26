const { MessageEmbed, Client, MessageActionRow, MessageButton } = require('discord.js');
const coin = require("../../schemas/coin");
const ayar = require("../../configs/sunucuayar.json")
const conf = require("../../configs/sunucuayar.json")
const toplams = require("../../schemas/toplams");
const kayitg = require("../../schemas/kayitgorev");
const allah = require("../../configs/config.json");
const { red , green } = require("../../configs/emojis.json")
const isimler = require("../../schemas/names");
const regstats = require("../../schemas/registerStats");
const otokayit = require("../../schemas/otokayit");
const moment = require("moment")
moment.locale("tr")
const client = global.bot;

module.exports = {
  conf: {
    aliases: ["kayit", "kayıt", "kadın", "Kadın", "k", "kadin", "Kadin", "Woman", "kız", "Kız", "erkek", "Erkek", "e", "ERKEK", "Man", "man"],
    name: "kayıt",
    help: "kayıt [üye] [isim] [yaş]"
  },
run: async (client, message, args, embed, prefix) => { 
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ayar.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !ayar.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content:`Yetkin bulunmamakta dostum.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(!uye) 
    {
    message.react(red)
    message.reply({ content:`\`${prefix}kayıt <@aspect/ID> <Isim> <Yaş>\``}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(message.author.id === uye.id) 
    {
    message.react(red)
    message.reply({ content:`Kendini kayıt edemezsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(!uye.manageable) 
    {
    message.react(red)
    message.reply({ content:`Böyle birisini kayıt edemiyorum.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(red)
    message.reply({ content:`Senden yüksekte olan birisini kayıt edemezsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
    message.react(red)
    message.reply({ content:`\`${prefix}kayıt <@aspect/ID> <Isim> <Yaş>\``}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }

   const tagModedata = await regstats.findOne({ guildID: message.guild.id })
    if (tagModedata && tagModedata.tagMode === true) {
    if(!uye.user.username.includes(ayar.tag) && !uye.roles.cache.has(ayar.vipRole) && !uye.roles.cache.has(ayar.boosterRolu)) return message.reply({ embeds: [embed.setDescription(`${uye.toString()} isimli üyenin kullanıcı adında tagımız (\` ${ayar.tag} \`) olmadığı, <@&${ayar.boosterRolu}>, <@&${ayar.vipRole}> Rolü olmadığı için isim değiştirmekden başka kayıt işlemi yapamazsınız.`)] });
    }

    if(!yaş) 
    { setName =`${ayar.tag} ${isim}`;
    } else { setName = `${ayar.tag} ${isim} | ${yaş}`;
  }

    uye.setNickname(`${setName}`).catch(err => message.reply({ content:`İsim çok uzun.`}))
    const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.member.id });

    if(!uye.roles.cache.has(ayar.erkekRolleri) && !uye.roles.cache.has(ayar.kizRolleri)) {

    const row = new MessageActionRow()
		.addComponents(

    new MessageButton()
    .setCustomId("MAN")
    .setLabel("Erkek")
    .setStyle("PRIMARY")
    .setEmoji("916010225289560074"),

    new MessageButton()
    .setCustomId("WOMAN")
    .setLabel("Kadın")
    .setStyle("SUCCESS")
    .setEmoji("916010235200679996"),

    new MessageButton()
    .setCustomId("İPTAL")
    .setLabel("İptal")
    .setStyle("DANGER")
    .setEmoji("920412153712889877"),

	);
      

       const row2 = new MessageActionRow()
		.addComponents(

    new MessageButton()
    .setCustomId("success")
    .setLabel("Kaydı Tamamlandı")
    .setStyle("SECONDARY")
    .setEmoji("1084606241004855327")
    .setDisabled(true),

	);

    let erkekRol = ayar.erkekRolleri;
    let kadinRol = ayar.kizRolleri;

    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });
       let page = 1;
  let liste = data ? data.names.map((x, i) => `\` ${i + 1} \` \` ${x.name} \` ${x.sebep ? `(${x.sebep})` : ""} ${x.rol ? `(${x.rol})` : ""} ${x.yetkili ? `(<@${x.yetkili}>)` : ""} <t:${Math.floor(x.date / 1000)}:R>`) : "Bu kullanıcıya ait isim geçmişi bulunmuyor!"
    message.react(green)
let ozi = new MessageEmbed()
.setDescription(`
${uye.toString()} Üyesinin ismi \`"${setName}"\` olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.

${green} Üyesinin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu
${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}
`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setFooter({ text: `Lütfen 30 saniye alttaki butonlara basarak kullanıcının cinsiyetini belirleyin.` })

 let msg = await message.channel.send({ embeds: [ozi], components : [row] })
 
 var filter = (button) => button.user.id === message.author.id;
 let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

      collector.on("collect", async (button) => {

if(button.customId === "MAN") {

  let ozie = new MessageEmbed()
.setDescription(`
${uye.toString()}, Üyesinin ismi **${setName}** olarak değiştirildi.

**Erkek** olarak kayıt edildi.
`)
  if(msg) msg.delete();
msg.channel.send({ embeds: [ozie], components: [row2]});

    await uye.roles.add(["914479013907562507","914479013907562507"])
    await uye.roles.remove(ayar.unregRoles)
   await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
    await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
    await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: conf.erkekRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (kayitgData)
    {
    await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
    }



    if(ayar.chatChannel && client.channels.cache.has(ayar.chatChannel)) client.channels.cache.get(ayar.chatChannel).send({ content:`Aramıza hoşgeldin **${uye}**! Kuralları okumayı unutma!`}).then((e) => setTimeout(() => { e.delete(); }, 20000));

         await otokayit.updateOne({
          userID: uye.user.id
           }, {
           $set: {
                  userID: uye.user.id,
                  roleID: erkekRol,
                  name: isim,
                  age: yaş
                }
             }, {
                 upsert: true
              }).exec();

}

if(button.customId === "WOMAN") {

let ozik = new MessageEmbed()
.setDescription(`
${uye.toString()}, Üyesinin ismi **${setName}** olarak değiştirildi.

**Kadın** olarak kayıt edildi.
`)
if(msg) msg.delete();
msg.channel.send({ embeds: [ozik], components: [row2]});

    await uye.roles.add(["914479013907562510","914479013907562512"])
-    await uye.roles.remove(ayar.unregRoles)
    await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
    await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
    await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: conf.kizRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (kayitgData)
    {
    await kayitg.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { kayit: 1 } }, { upsert: true });
    }


   if(ayar.chatChannel && client.channels.cache.has(ayar.chatChannel)) client.channels.cache.get(ayar.chatChannel).send(`${uye} **Aramıza hoşgeldin  Kuralları okumayı unutma!**`).then(x => x.delete({timeout: 10000})) .then((e) => setTimeout(() => { e.delete(); }, 20000));

         await otokayit.updateOne({
          userID: uye.user.id
           }, {
           $set: {
                  userID: uye.user.id,
                  roleID: kadinRol,
                  name: isim,
                  age: yaş
                }
             }, {
                 upsert: true
              }).exec();

}

if(button.customId === "İPTAL") {
if(msg) msg.delete();
button.reply({ content:`İşlem Başarıyla İptal Edildi ${green}`, embeds: [], components: [], ephemeral: true});
uye.setNickname(`${ayar.ikinciTag} İsim | Yaş`)
await uye.roles.add(ayar.unregRoles)
await uye.roles.remove(ayar.kizRolleri)
await uye.roles.remove(ayar.erkekRolleri)
}

   });

  }
}   
}
