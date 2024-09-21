import checkProps from '../checkProps.js';
import { dbGet } from '../db.js';
import { createSession } from '../session.js';
import { hashPassword } from '../utils.js';

export async function post(db, { userId, body }) {
    if (userId !== null) return [400, { error: 'Вы уже вошли в систему.' }];
    const check = checkProps(['email', 'password'], body);
    if (check) return [400, { error: check }];

    const [user] = await dbGet(db, 'SELECT * FROM users WHERE email = ?', body.email);
    if (!user) return [400, { error: 'Пользователь не найден.' }];
    if (user.password !== hashPassword(body.password)) return [400, { error: 'Неверный пароль.' }];

    const [token, expires] = await createSession(db, user.id);
    return [200, {}, {
        sessionToken: `${token}; Expires=${expires}`
    }];
}