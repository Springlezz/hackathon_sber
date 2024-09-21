import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const [{ role }] = await dbGet(db, 'SELECT role FROM users WHERE id = ?', userId);
    if (role === 0) return [403, { error: 'Недостаточно прав для совершения действия.' }];
    const check = checkProps(['id'], body);
    if (check) return [400, { error: check }];
    const [event] = await dbGet(db, 'SELECT creator FROM events WHERE id = ?', body.id);
    if (!event) return [404, { error: 'Событие не найдено.' }];
    if (role === 1 && event.creator !== userId) return [401, { error: 'Недостаточно прав для совершения действия.' }];

    await dbRun(db, 'DELETE FROM events WHERE id = ?', body.id);

    return [200, {}];
}