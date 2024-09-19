import { createHash } from 'crypto';
import checkProps from '../checkProps.js';
import { dbGet } from '../db.js';
import { createSession } from '../session.js';

export async function post(db, { userId, body }) {
    if (userId !== null) return [401, { error: 'Вы уже вошли в систему.' }];
    const check = checkProps(['email', 'password'], body);
    if (check) return [400, { error: check }];

    const [user] = await dbGet(db, 'SELECT * FROM users WHERE email = ?', body.email);
    if (!user) return [401, { error: 'Пользователь не найден.' }];
    if (user.password !== createHash('sha256').update(body.password).digest('hex')) return [401, { error: 'Неверный пароль.' }];

    const [token, expires] = await createSession(db, user.id);
    return [200, {}, {
        sessionToken: `${token}; Expires=${expires}`
    }];
}