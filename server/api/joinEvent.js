import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const [{ role }] = await dbGet(db, 'SELECT role FROM users WHERE id = ?', userId);
    if (role === 0) return [403, { error: 'Недостаточно прав для совершения действия.' }];
    const check = checkProps(['id'], body);
    if (check) return [400, { error: check }];

    const [event] = await dbGet(db, 'SELECT creator, confirmed, accepted FROM events WHERE id = ?', body.id);
    if (!event) return [404, { error: 'Событие не найдено.' }];
    if (event.creator === userId) return [400, { error: 'Вы не можете присоединиться к событию, которое создали.' }];
    else {
        if (!event.confirmed) return [403, { error: 'Событие ещё не подтверждено.' }];
        if (!event.accepted) return [403, { error: 'Событие было отклонено.' }];
    }

    const [eventUser] = await dbGet(db, 'SELECT id FROM event_users WHERE user_id = ? AND event_id = ?', userId, body.id);
    if (eventUser) return [400, { error: 'Вы уже присоединились к этому событию.' }];

    await dbRun(db, 'INSERT INTO event_users (user_id, event_id) VALUES (?, ?)', userId, body.id);

    return [200, {}];
}