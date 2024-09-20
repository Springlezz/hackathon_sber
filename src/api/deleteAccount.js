import { checkProps } from '../checkProps.js';
import { dbRun } from '../db.js';
import { hashPassword } from '../utils.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['password'], body);
    if (check) return [400, { error: check }];

    const [{ password }] = await dbGet(db, 'SELECT password FROM users WHERE id = ?', userId);
    if (password !== hashPassword(body.password)) return [401, { error: 'Неверный пароль.' }];

    await dbRun(db, 'DELETE FROM users WHERE id = ?', userId);
    return [200, {}, { sessionToken: '; Expires=Thu, 01 Jan 1970 00:00:00 GMT' }];
}