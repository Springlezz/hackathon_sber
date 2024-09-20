import checkProps from '../checkProps.js';
import { dbAll, dbGet } from '../db.js';
import { isNoNegInt } from '../utils.js';

export async function get(db, { userId, search }) {
    const check = checkProps(['timeStart', 'timeEnd', 'tags'], search);
    if (check) return [400, { error: check }];

    let sql = 'SELECT * FROM events';
    let eventTags = [];
    if (search.tags) {
        eventTags = search.tags.split(',');
        for (const tag of eventTags) {
            if (!isNoNegInt(tag)) return [400, { error: 'Неверный идентификатор тега.' }];
        }
        sql += `
            JOIN event_tags ON events.id = event_tags.event_id
            WHERE time >= ? AND time <= ? AND event_tags.tag_id IN (${eventTags.map(() => '?').join(', ')})
        `;
    }
    else {
        const [[events], [role]] = await Promise.all([
            dbAll(db, sql, timeStart, timeEnd, ...eventTags),
            userId === null ? 0 : dbGet(db, 'SELECT role FROM users WHERE id = ?', userId).then(user => user[0].role)
        ]);
        return [200, {
            events: events.filter(event => role === 2 || event.creator === userId || (event.confirmed && event.accepted)).map(event => ({
                title: event.title,
                description: event.description,
                time: event.time,
                duration: event.duration,
                location: event.location
            }))
        }];
    }
}