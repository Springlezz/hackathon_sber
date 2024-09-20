import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const [{ role }] = await dbGet(db, 'SELECT role FROM users WHERE id = ?', userId);
    if (role === 0) return [401, { error: 'Недостаточно прав для совершения действия.' }];
    const check = checkProps(['id'], body);
    if (check) return [400, { error: check }];

    const [event] = await dbGet(db, 'SELECT id FROM event_users WHERE user_id = ? AND event_id = ?', userId, body.id);
    if (!event) return [400, { error: 'Вы не присоединялись к этому событию.' }];

    await dbRun(db, 'DELETE FROM event_users WHERE user_id = ? AND event_id = ?', userId, body.id);

    return [200, {}];
}