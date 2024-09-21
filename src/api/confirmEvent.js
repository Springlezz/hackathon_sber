import checkProps from '../checkProps.js';
import { dbAll, dbGet, dbRun } from '../db.js';
import { sendMessageWithKeyboard } from '../telegramBot.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const [{ role }] = await dbGet(db, 'SELECT role FROM users WHERE id = ?', userId);
    if (role < 2) return [403, { error: 'Недостаточно прав для совершения действия.' }];
    const check = checkProps(['id', 'accepted'], body);
    if (check) return [400, { error: check }];

    const [, { changes }] = await dbRun(db, 'UPDATE events SET confirmed = 1, accepted = ? WHERE id = ?', body.accepted, body.id);

    if (changes === 0) return [404, { error: 'Событие не найдено.' }];
    else {
        const [[telegrams], [event]] = await Promise.all([
            dbAll(db, 'SELECT telegram FROM events WHERE telegram != NULL AND telegram_notifications = 1'),
            dbGet(db, 'SELECT title, description, location, time, duration FROM events WHERE id = ?', body.id)
        ]);

        const message = `<b>${event.title}</b>
Место прохождения: ${event.location}
Время: ${new Date(event.time).toLocaleString('ru', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
Длительность: ${event.duration / 60} минут

${event.description}`;

        for (const tg of telegrams) {
            sendMessageWithKeyboard(tg.telegram, message);
        }
    }

    return [200, {}];
}