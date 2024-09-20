import checkProps from '../checkProps.js';
import { dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    if ((await dbGet(db, 'SELECT role FROM users WHERE id = ?', userId))[0].role === 0) return [401, { error: 'Недостаточно прав для совершения действия.' }];
    const check = checkProps(['title', 'description', 'location', 'time', 'tags'], body);
    if (check) return [400, { error: check }];

    if (!Array.isArray(body.tags)) return [400, { error: 'Неверные теги.' }];
    for (const tag of body.tags) {
        if (!isNoNegInt(tag)) return [400, { error: 'Неверные теги.' }];
    }
    const [numTags] = await dbGet(db, `SELECT COUNT(*) as numTags FROM tags WHERE id IN (${body.tags.map(() => '?').join(', ')})`, ...body.tags);
    if (numTags !== body.tags.length) return [400, { error: 'Неверные теги.' }];

    const [{ lastID }] = await dbRun(db, 'INSERT INTO events (creator, time_created, time_ended, title, description, location) VALUES (?, ?, ?, ?, ?, ?)', userId, Math.floor(Date.now() / 1000), body.time, body.title, body.description, body.location);
    for (const tag of body.tags) {
        await dbRun(db, 'INSERT INTO event_tags (event_id, tag_id) VALUES (?, ?)', lastID, tag);
    }

    return [200, {}];
}