const TelegramApiBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '5812407944:AAGdAzfmEXcPXZLia-ZvAM00qO3QTjFJLGE';

const bot = new TelegramApiBot(token, {polling: true});

const chats = {};



const startGame = async (chatId) => {
    await  bot.sendMessage(chatId, `Смотри, я загадываю цифру от 0 до 9, а ты ее угадываешь, понял?`);
    const randomNumber = Math.floor(Math.random()*10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Давай, отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const userName = msg.from.first_name;

        if (text === '/start') {
            await bot.sendMessage(chatId, `Дарова, ${userName}!`);
            return  bot.sendAnimation(chatId, 'https://media.tenor.com/m12yFfLrIS8AAAAM/welcome-to-the-club-buddy.gif')
        }

        if (text === '/info') {
            return  bot.sendMessage(chatId, `Это тестовый бот 1.0, он может сыграть с тобой в игру и на этом все...`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Ты что-то не то нажимаешь!');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data == chats[chatId]) {
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEHLO9juth3d9PIj73PUCG1VuEOyIuI_gACPgADHywSA21scEN0Kp-CLQQ');
            return bot.sendMessage(chatId, `Ура!🔥🔥🔥 \n Ты правильно ткнул в цифру ${chats[chatId]}`, againOptions);
        } else {
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAEHLORjutfdrCs98yOlh9ksOGVoJ1BmKAACPwADHywSAyDDGB_n8ZEAAS0E');
            return bot.sendMessage(chatId, `Не правильно! 🙁 \n Я загадал  ${chats[chatId]}`, againOptions);
        }
    })
}

start();


