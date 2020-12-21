const Discord = require('discord.js');

/**
 * @description Возвращает true/false в зависимости от наличия роли у автора сообщения
 * @param { Discord.Guild } guild
 * @param {string} roleName Название роли
 * @param {string} userid ID пользователя
 */
const haveRole = (guild, roleName, userid) => {
  try {
    const member = guild.members.cache.find(user => user.id == userid);

    return !! member.roles.cache.find(r => r.name.toLowerCase() == roleName.toLowerCase());
  } catch (err) {
    console.log(err);
  }
}

module.exports = haveRole;