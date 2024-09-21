import { deleteSession } from '../session.js';

export async function get(db, { userId, token }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];
    await deleteSession(db, token);
    return [200, {}, { sessionToken: '; Expires=Thu, 01 Jan 1970 00:00:00 GMT' }];
}