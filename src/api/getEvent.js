import { dbGet } from '../db.js';

export async function get(db, { userId, search }) {
    const check = checkProps(['id'], search);
    if (check) return [400, { error: check }];

    const [[event], role] = await Promise.all([
        dbGet(db, 'SELECT * FROM events WHERE id = ?', search.id),
        userId === null ? 0 : dbGet(db, 'SELECT role FROM users WHERE id = ?', userId).then(user => user[0].role)
    ]);
    if (!event) return [404, { error: 'Событие не найдено.' }];
    if (role < 2 && event.creator !== userId) {
        if (!event.confirmed) return [403, { error: 'Событие ещё не подтверждено.' }];
        if (!event.accepted) return [403, { error: 'Событие было отклонено.' }];
    }
    return [200, {
        title: event.title,
        description: event.description,
        time: event.time,
        duration: event.duration,
        location: event.location,
        joined: userId ? !!(await dbGet(db, 'SELECT id FROM event_users WHERE user_id = ? AND event_id = ?', userId, search.id))[0] !== undefined : undefined,
        tags: (await dbGet(db, 'SELECT tag_id FROM event_tags WHERE event_id = ?', search.id)).map(tag => tag.tag_id)
    }];
}