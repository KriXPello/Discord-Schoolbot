const Discord = require('discord.js');
const haveRole = require('./haveRole');

const createMessage = time => 
'Перекличка начата.' +
'Оставьте любую реакцию на этом сообщении чтобы отметиться. ' +
'**ВАЖНО!** У вас должна быть роль с названием "ученик" чтобы отметиться. ' +
`Минут до конца переклички: ${(time / 60000).toFixed(0)}`;

/**
 * @description Создаёт счётчик для отметившихся пользователей
 * @param {Discord.Message} msg 
 * @param {Array} pointedIds 
 */
const makeCounter = (msg, pointedIds) => 
  /**
   * @param {Discord.ReactionEmoji} reaction 
   * @param {Discord.GuildMember} user
   */
    (reaction, user) => {
    if (! haveRole(msg.guild, 'ученик', user.id)) return;
    if (pointedIds.includes(user.id)) return;
  
    pointedIds.push(user.id);

    return true;
  }

/**
 * @description Завершает перекличку, подводит результаты
 * @param {Discord.Message} msg объект сообщения бота
 * @param {Array} pointedIds 
 */
const finish = (msg, pointedIds) => {
  let list = [];

  msg.channel.members.forEach(member => {
    if (! haveRole(msg.guild, 'ученик', member.id)) return;

    const name = member.nickname ? member.nickname : member.user.username;

    list.push(pointedIds.includes(member.id) ? `${name} +` : `${name} -`);
  });

  list = list.sort().map(str => {
    return str[str.length - 1] == '-'
      ? '- ' + str.slice(0, -2)
      : '+ ' + str.slice(0, -2);
  })

  let text = `Перекличка завершена (+ означает, что ученик отметился):\n${list.join('\n')}`;
  
  msg.edit(text);
}

/**
 * @description Функция для проведения переклички
 * @param {Discord.Message} message 
 */
const rollcall = message => {
  try {
    let remainingTime = 120000; // 7200000 мс - 2 часа
    let pointedIds = [];

    message.channel.send(createMessage(remainingTime))
      .then((msg) => {
        msg.awaitReactions(makeCounter(msg, pointedIds), { time: remainingTime })
          .then(() => {
            finish(msg, pointedIds);
          })

        msg.react('👋');
        
        const timer = setInterval(() => {
          remainingTime -= 60000;
          msg.edit(createMessage(remainingTime));
        }, 60000);

        setTimeout(() => {
          clearInterval(timer);
        }, remainingTime - 5000);
      })
  } catch (err) {
    console.log(err);
  }
}

module.exports = rollcall;