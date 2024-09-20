import { dbGet } from '../db.js';

export async function get(db, { search }) {
    const check = checkProps(['id'], search);
    if (check) return [400, { error: check }];

    const [event] = await dbGet(db, 'SELECT title, description, time, location from events WHERE id = ?', search.id);
    if (!event) return [404, { error: 'Событие не найдено.' }];
    return [200, {
        ...event,
        tags: (await dbGet(db, 'SELECT tag_id FROM event_tags WHERE event_id = ?', search.id)).map(tag => tag.tag_id)
    }];
}