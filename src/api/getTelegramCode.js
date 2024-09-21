import { randomBytes } from 'crypto';
import { dbRun } from '../db.js';

export async function get(db, { userId, search }) {
    if (userId !== null) return [400, { error: 'Вы уже вошли в систему.' }];
    const check = checkProps(['type'], search);
    if (check) return [400, { error: check }];
    if (!['login', 'register'].includes(search.type)) return [400, { error: 'Неверный тип запроса.' }];

    const code = randomBytes(16).toString('hex');
    await dbRun(db, 'INSERT INTO telegram_auth (type, code, expires) VALUES (?)', search.type === 'login' ? 0 : 1, code, Date.now() + 5 * 60_000);

    return [200, { code }];
}