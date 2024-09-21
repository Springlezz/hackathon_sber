import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';
import { hashPassword } from '../utils.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['oldPassword', 'password', 'password2'], body);
    if (check) return [400, { error: check }];

    const [{ password }] = await dbGet(db, 'SELECT password FROM users WHERE id = ?', userId);
    if (password !== hashPassword(body.oldPassword)) return [400, { error: 'Неверный пароль.' }];
    if (body.password !== body.password2) return [400, { error: 'Пароли не совпадают.' }];

    await dbRun(db, 'UPDATE users SET password = ? WHERE id = ?', hashPassword(body.password), userId);

    return [200, {}];
}