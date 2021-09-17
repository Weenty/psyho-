const telegramApi = require("node-telegram-bot-api")
const token = '1999864121:AAERJTXKJvu14wq4uGVRiomoNBg8olsSE_c'
const bot = new telegramApi(token,{polling:true})


bot.on('message', (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const imya = msg.chat.username;
    const fam = msg.chat.first_name;
    if (text === '/start')
{
    bot.sendMessage(chatId,'Добро пажаловать в психушку'+" "+imya  +" "+'Чтобы ознакомиться с нашей инфой напиши info')
}
if (text === 'info')
{
    bot.sendMessage(chatId,'Ты в ДУРКЕ, поздравляю'+" "+imya)
}        
   console.log(msg);
  });