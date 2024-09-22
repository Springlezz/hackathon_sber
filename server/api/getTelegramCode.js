import { randomBytes } from 'crypto';
import checkProps from '../checkProps.js';
import { dbRun } from '../db.js';

export async function get(db, { userId, search }) {
    if (search.type === 'link') {
        if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    }
    else if (userId !== null) return [400, { error: 'Вы уже вошли в систему.' }];
    const check = checkProps(['type'], search);
    if (check) return [400, { error: check }];
    if (!['login', 'register', 'link'].includes(search.type)) return [400, { error: 'Неверный тип запроса.' }];

    const code = randomBytes(16).toString('hex');
    await dbRun(db, 'INSERT INTO telegram_auth (type, code, expires) VALUES (?, ?, ?)', ['login', 'register', 'link'].indexOf(search.type), code, Date.now() + 5 * 60_000);

    return [200, { code }];
}