import checkProps from '../checkProps.js';
import { dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['title', 'description', 'location', 'time', 'tags'], body);
    if (check) return [400, { error: check }];

    if (!Array.isArray(body.tags)) return [401, { error: 'Неверные теги.' }];
    for (const tag of body.tags) {
        if (!isNoNegInt(tag)) return [401, { error: 'Неверные теги.' }];
    }

    const [{ lastID }] = await dbRun(db, 'INSERT INTO events (creator, time_created, time_ended, title, description, location) VALUES (?, ?, ?, ?, ?, ?)', userId, Math.floor(Date.now() / 1000), body.time, body.title, body.description, body.location);
    for (const tag of body.tags) {
        await dbRun(db, 'INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)', lastID, tag);
    }

    return [200, {}];
}