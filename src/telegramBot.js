import { request } from 'https';
import { dbAll, dbGet, dbRun } from './db.js';

const TELEGRAM_TOKEN = '********************************************';

function botApi(name, data) {
    return new Promise(function(resolve, reject) {
        const req = request({
            method: 'POST',
            host: 'api.telegram.org',
            path: `/bot${TELEGRAM_TOKEN}/${name}`,
            headers: { 'Content-Type': 'application/json' }
        }, function(res) {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.end(JSON.stringify(data));
    });
}

function sendMessage(chatId, text) {
    return botApi('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML' });
}
function sendMessageWithKeyboard(chatId, text) {
    return botApi('sendMessage', {
        chat_id: chatId, text, parse_mode: 'HTML', reply_markup: {
            keyboard: [
                ['👤 О пользователе'],
                ['🎉 События'],
                ['❌ Отвязать аккаунт']
            ]
        }
    });
}
export function sendEvent(userId, event) {
    const message = `<b>${event.title}</b>
Место прохождения: ${event.location}
Время: ${new Date(event.time).toLocaleString('ru', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
Длительность: ${event.duration / 60} минут

${event.description}`;
    sendMessageWithKeyboard(userId, message);
}

export default async function initTelegramBot(db) {
    let offset = 0;
    while (true) {
        const { ok, result } = await botApi('getUpdates', { offset, timeout: 5000 });
        if (ok) {
            offset += result.length;
            for (const { update_id, message } of result) {
                dbGet(db, 'SELECT * FROM users WHERE telegram = ?', message.from.id).then(async function([user]) {
                    switch (message.text) {
                        case '/start':
                            await (user ? sendMessageWithKeyboard : sendMessage)(message.chat.id, `Добро пожаловать, <b>${message.from.first_name}🎊</b>! Я - <b>Бот Хакатона v0\u00ad.0\u00ad.­0\u00ad.0.\u00ad0.\u00ad0.\u00ad0.\u00ad1 beta</b> для "Крона"✨.\nБуду вашим верным помощником! ❤️` + (user ? '' : `\nПожалуйста, привяжите аккаунт Телеграма к сайту ➡️➡️➡️ <i>ссылка на сайт</i>.`));
                            break;
                        case '👤 О пользователе':
                            if (!user) return sendMessage(message.chat.id, '⚠️ Этот телеграм не привязан к аккаунту.');
                            sendMessageWithKeyboard(message.chat.id, `<u><b>👤 Информация о пользователе:</b></u>
<b>👤 ФИО:</b> ${user.first_name} ${user.second_name} ${user.third_name}
<b>✉️ Почта:</b> ${user.email ?? '&lt;нет&gt;'}
<b>💁‍♂️ Роль:</b> ${['👤 пользователь', '👑 резидент', '👨‍💻 администратор'][user.role]}
<b>🏙 Город:</b> ${user.city}
<b>🌍 Страна:</b> ${user.country}`, { parse_mode: 'HTML' });
                            break;
                        case '🎉 События':
                            if (!user) return sendMessage(message.chat.id, '⚠️ Этот телеграм не привязан к аккаунту.');
                            dbAll(db, 'SELECT * FROM events JOIN event_users ON event_users.event_id = events.id WHERE event_users.user_id = ?', user.id).then(function([events]) {
                                if (events.length === 0) return sendMessage(message.chat.id, '⚠️ У вас нет событий.');
                                for (const event of events) {
                                    sendEvent(message.chat.id, event);
                                }
                            });
                            break;
                        case '❌ Отвязать аккаунт':
                            if (!user) return sendMessage(message.chat.id, '⚠️ Этот телеграм не привязан к аккаунту.');
                            if (user.password === null) return sendMessageWithKeyboard(message.chat.id, '⚠️ Вы не можете отвязать телеграм от аккаунта без пароля.');
                            dbRun(db, 'UPDATE users SET telegram = NULL WHERE id = ?', user.id);
                            sendMessage(message.chat.id, '✅ Вы успешно отвязали свой аккаунт.');
                            break;
                        default:
                            if (/^[0-9a-f]{32}$/.test(message.text)) {
                                dbGet(db, 'SELECT type, telegram FROM telegram_auth WHERE code = ?', message.text).then(async function([auth]) {
                                    if (!auth) return sendMessage(message.chat.id, '⚠️ Код недействителен.');
                                    if (auth.telegram !== null) return sendMessage(message.chat.id, '⚠️ Вы уже вводили этот код.');
                                    if (auth.type === 1) { // register
                                        const [user] = await dbGet(db, 'SELECT id FROM users WHERE telegram = ?', message.from.id);
                                        if (user) return sendMessageWithKeyboard(message.chat.id, '⚠️ Этот телеграм уже привязан к аккаунту.');
                                    }
                                    await dbRun(db, 'UPDATE telegram_auth SET telegram = ? WHERE code = ?', message.from.id, message.text);
                                    sendMessageWithKeyboard(message.chat.id, `✅ Вы успешно ${['вошли в систему', 'зарегистрировались'][auth.type]}.Вернитесь на страницу входа и нажмите кнопку "Продолжить"❗️❗️❗️`);
                                });
                            }
                            else (user ? sendMessageWithKeyboard : sendMessage)(message.chat.id, '🤷‍♂️ Я не понял, что вы хотите мне сообщить.');
                    }
                });
                offset = update_id + 1;
            }
        }
    }
};
