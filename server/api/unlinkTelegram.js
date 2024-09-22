import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';
import { createSession } from '../session.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['code'], body);
    if (check) return [400, { error: check }];

    const [{password}] = await dbGet(db, 'SELECT password FROM users WHERE id = ?', userId);
    if (password===null) return [400, { error: 'Невозможно отвязать Telegram от аккаунта без пароля.' }];

    await dbRun(db, 'UPDATE users SET telegram = NULL, telegram_notifications = 0 WHERE id = ?', userId);
    return [200, {}];
}