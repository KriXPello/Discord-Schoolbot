const Discord = require('discord.js');
const fs = require('fs');
const haveRole = require('./modules/haveRole.js');
const rollcall = require('./modules/rollcall.js');

/** @type { Tokens } */
const tokens = JSON.parse(fs.readFileSync('./storages/tokens.json', 'utf8'));

const client = new Discord.Client();
client.login(tokens.dev);

client.on('message', message => {
  if (! message.content.startsWith('!')) return;
  if (! haveRole(message.guild, 'учитель', message.author.id)) return;

  if (message.content.toLowerCase().startsWith('!п')) {
    rollcall(message);
  }
})