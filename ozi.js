
const allah = require("./src/configs/config.json");
const { Client, Collection } = require("discord.js");
const { miniicon, voice, mesaj2, star } = require("./src/configs/emojis.json")
const client = global.bot = new Client({
  fetchAllMembers: true,
  intents: [ 32767 ],
}); 
const Discord = require('discord.js');
const conf = require("./src/configs/sunucuayar.json");
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

const { Database } = require("ark.db");
const rankdb = (global.rankdb = new Database("./src/configs/ranks.json"));
client.ranks = rankdb.get("ranks") ? rankdb.get("ranks").sort((a, b) => a.coin - b.coin) : 
[
{ role: "914479013920129119", coin: 800 },
  { role: "914479013920129120", coin: 1600 },
  { role: "914479013920129121", coin: 2400 },
  { role: "914479013920129122", coin: 3200 },
  { role: "914479013920129123", coin: 4300 },
  { role: "914479013928501290", coin: 5400 },
  { role: "914479013928501291", coin: 6500 },
  { role: "914479013928501292", coin: 7600 },
  { role: "914479013928501293", coin: 8700 },
  { role: "914479013928501294", coin: 9800 },
  { role: "914479013928501296", coin: 11300 },
];
//KOMUT ÇALIŞTIRMA
fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[Aspect] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        console.log(`[Aspect KOMUT] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(process.env.token)
  .then(() => console.log("Bot Başarıyla Bağlandı!"))
  .catch(() => console.log("[HATA] Bot Bağlanamadı!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });


  ///// slash commands
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');  
  client.slashcommands = new Collection();
  var slashcommands = [];
  
  fs.readdirSync('./src/Slashcommands/').forEach(async category => {
		const commands = fs.readdirSync(`./src/Slashcommands/${category}/`).filter(cmd => cmd.endsWith('.js'));
		for (const command of commands) {
		const Command = require(`./src/Slashcommands/${category}/${command}`);
    client.slashcommands.set(Command.data.name, Command);
    slashcommands.push(Command.data.toJSON());
		}
	});
  
	const rest = new REST({ version: '9' }).setToken(process.env.token);
  (async () => {
	try {
		console.log('[Aspect] Slash ve Komutlar yükleniyor.');
		await rest.put(
			Routes.applicationGuildCommands(allah.Main.BotClientID, allah.GuildID),
			{ body: slashcommands },
		).then(() => {
			console.log('[Aspect] Slash ve Context Komutlar yüklendi.');
		});
	}
	catch (e) {
		console.error(e);
	}
})();

client.on('interactionCreate', (interaction) => {
  if (interaction.isContextMenu() || interaction.isCommand()) {
    const command = client.slashcommands.get(interaction.commandName);
    if (interaction.user.bot) return;
    if (!interaction.inGuild() && interaction.isCommand()) return interaction.editReply({ content: 'Komutları kullanmak için bir sunucuda olmanız gerekir.' });
    if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);
    try {
      command.execute(interaction, client);
    }
    catch (e) {
      console.log(e);
      return interaction.reply({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
    }
  }
});


////
let stats = require("./src/schemas/level");
 
let arr = [{
  Chat: "💬🥉",
  Voice: "🔊🥉",
  ChatColor: "#fa795b",
  VoiceColor: "#fa795b",
  sLevel: 3,
  cLevel: 2
}, {
  Chat: "💬🥈",
  Voice: "🔊🥈",
  ChatColor: "#cfcbcb",
  VoiceColor: "#cfcbcb",
  sLevel: 8,
  cLevel: 5
}, {
  Chat: "💬🥇",
  Voice: "🔊🥇",
  ChatColor: "#fffb00",
  VoiceColor: "#fffb00",
  sLevel: 20,
  cLevel: 35
}, {
  Chat: "💬🏆",
  Voice: "🔊🏆",
  ChatColor: "#23fafa",
  VoiceColor: "#23fafa",
  sLevel: 50,
  cLevel: 70
}]
client.checkLevel = async function (userID, guildID, type) {
  if (allah.Main.LevelSystem == false) return;
  let sunucu = client.guilds.cache.get(guildID);
  if (!sunucu) return;
  let kontrol = await stats.findOne({
    userID: userID,
    guildID: guildID
  });
  if (!kontrol) return;
  const channel = client.channels.cache.find(x => x.name == "level-bilgi");
  arr.map(async data => {
    if (type === "mesaj") {
      if (kontrol.messageLevel >= data.cLevel) {
        if (kontrol.autoRankup.includes(data.Chat)) return;
        stats.updateOne({userID: userID, guildID: guildID}, {$push: {autoRankup: data.Chat}}, {upsert: true}).exec()
        channel.send({ content: `:tada: <@${userID}> tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Chat}"** rolüne terfi edildin!`})
      };
    };
    if (type === "ses") {
      if (kontrol.voiceLevel >= data.sLevel) {
        if (kontrol.autoRankup.includes(data.Voice)) return;
        stats.updateOne({userID: userID, guildID: guildID}, {$push: {autoRankup: data.Voice}}, {upsert: true}).exec()
        channel.send({ content: `:tada: <@${userID}> tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Voice}"** rolüne terfi edildin!`})
      };
    };
  });
};

client.on('modalSubmit', async (modal) => {


 var LogChannel2 = client.guilds.cache.get(conf.GuildID).channels.cache.find((channel) => channel.id === conf.İSTEKÖNERİLOG);
    if(modal.customId === 'istekoneri') {
      const istekk = modal.getTextInputValue('istekk');  
      if (istekk) {
  let ii = new Discord.MessageEmbed().setColor("#2f3136")
  .setDescription(`
  ${modal.user} Üyesinin İsteği & Önerisi

 <a:kirmiziok:1086654243345272915> \`${istekk}\`
  `)
  .setTimestamp()     
        await modal.deferReply({ephemeral: true})
        await LogChannel2.send({ content: `@everyone ${modal.user}`,embeds: [ii] })         
      }
    }

 var LogChannel3 = client.guilds.cache.get(conf.GuildID).channels.cache.find((channel) => channel.id === conf.sikayetlog);
    if(modal.customId === 'sikayet') {
      const sikaayet = modal.getTextInputValue('sikaayet');  
      if (sikaayet) {
  let iii = new Discord.MessageEmbed().setColor("#2f3136")
  .setDescription(`
  ${modal.user} Üyesinin Sunucu Hakkındaki Şikayetleri

 <a:kirmiziok:1086654243345272915> \`${sikaayet}\`
  `)
  .setTimestamp()     
        await modal.deferReply({ephemeral: true})
        await LogChannel3.send({ content: `@everyone ${modal.user}`,embeds: [iii] })      
      }
    }

  var LogChannel = client.guilds.cache.get(conf.GuildID).channels.cache.find((channel) => channel.id === conf.BaşvuruLogChannelID);
    if(modal.customId === 'ybasvuru') {
      const isimyas = modal.getTextInputValue('isimyas');  
      const aktiflik = modal.getTextInputValue('aktiflik');  
      const yarar = modal.getTextInputValue('yarar');  
      const hakkında = modal.getTextInputValue('hakkında'); 
  
      if (hakkında) {
  let ozi = new Discord.MessageEmbed().setColor("#2f3136")
  .setDescription(`
  **${modal.user.tag}** - (\`${modal.user.id}\`) **Kullanıcısının Başvuru Formu**
  
  ${star}  **İsminiz ve yaşınız**
  \`${isimyas}\`
  
  ${star}  **Sunucumuzda günlük aktifliğiniz**
  \`${aktiflik}\`
  
  ${star}  **Sunucumuz için neler yapabilirsiniz**
  \`${yarar}\`
  
  ${star}  **Kendiniz hakkında biraz bilgi**
  \`${hakkında}\`
  
  ${modal.user} Kullanıcısı'nın Başvurusu;
  ${star} **Cevaplamak için :** \`.cevapla <user>.\`
  `)
  .setTimestamp()     
        await modal.deferReply({ephemeral: true})
        await LogChannel.send({ content: `<@&${conf.YetkiliAlımRoleID}> ${modal.user}`,  embeds: [ozi] })      
      }
    }  
})
