import { dbGet } from '../db.js';

export async function get(db) {
    return [200, {
        tags: await dbGet(db, 'SELECT * FROM tags')
    }];
}