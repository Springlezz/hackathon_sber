import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['email', 'firstName', 'secondName', 'thirdName', 'country', 'city', 'telegramNotifications'], body);
    if (check) return [400, { error: check }];

    const [user] = await dbGet(db, 'SELECT id FROM users WHERE email = ?', body.email);
    if (user && user.id !== userId) return [400, { error: 'Такой пользователь уже существует.' }];
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(body.email)) return [400, { error: 'Некорректная почта.' }];

    const [user2] = await dbGet(db, 'SELECT telegram FROM users WHERE id = ?', userId);
    if (body.telegramNotifications && user2.telegram === null) return [400, { error: 'Невозможно включить уведомления. Аккаунт не привязан к Telegram' }];

    await dbRun(db, 'UPDATE users SET email = ?, first_name = ?, second_name = ?, third_name = ?, country = ?, city = ?, telegram_notifications = ? WHERE id = ?', body.email, body.firstName, body.secondName, body.thirdName, body.country, body.city, +body.telegramNotifications, userId);
    return [200, {}, {}];
}