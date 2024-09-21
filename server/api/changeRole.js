import checkProps from '../checkProps.js';
import { dbGet } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const [{ role }] = await dbGet(db, 'SELECT role FROM users WHERE id = ?', userId);
    if (role < 2) return [403, { error: 'Недостаточно прав для совершения действия.' }];
    const check = checkProps(['id', 'role'], body);
    if (check) return [400, { error: check }];
    if (![0, 1, 2].includes(body.role)) return [400, { error: 'Неверный уровень доступа.' }];

    const [, { changes }] = await dbRun(db, 'UPDATE users SET role = ? WHERE id = ?', body.role, body.id);
    if (changes === 0) return [404, { error: 'Пользователь не найден.' }];
    return [200, {}];
}