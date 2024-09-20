import checkProps from '../checkProps.js';
import { dbGet, dbRun } from '../db.js';

export async function post(db, { userId, body }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    const check = checkProps(['email', 'firstName', 'secondName', 'thirdName', 'country', 'city'], body);
    if (check) return [400, { error: check }];

    const [user] = await dbGet(db, 'SELECT id FROM users WHERE email = ?', body.email);
    if (user && user.id !== userId) return [401, { error: 'Такой пользователь уже существует.' }];
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(body.email)) return [401, { error: 'Некорректная почта.' }];

    await dbRun(db, 'UPDATE users SET email = ?, first_name = ?, second_name = ?, third_name = ?, country = ?, city = ? WHERE id = ?', body.email, body.firstName, body.secondName, body.thirdName, body.country, body.city, userId);
    return [200, {}, {}];
}