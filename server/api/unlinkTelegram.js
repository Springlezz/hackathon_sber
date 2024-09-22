import { dbGet, dbRun } from '../db.js';

export async function get(db, { userId }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];

    const [{ password }] = await dbGet(db, 'SELECT password FROM users WHERE id = ?', userId);
    if (password === null) return [400, { error: 'Невозможно отвязать Telegram от аккаунта без пароля.' }];

    await dbRun(db, 'UPDATE users SET telegram = NULL, telegram_notifications = 0 WHERE id = ?', userId);

    return [200, {}];
}