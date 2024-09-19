import { dbRun } from './db.js';

const tables = {
    users: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'role INTEGER NOT NULL DEFAULT 0', // 0 - user, 1 - resident, 2 - moderator
        'password TEXT NOT NULL',
        'email TEXT NOT NULL',
        'first_name TEXT NOT NULL',
        'second_name TEXT NOT NULL',
        'third_name TEXT NOT NULL'
    ],
    sessions: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'token TEXT NOT NULL',
        'user_id INTEGER NOT NULL',
        'expires INTEGER NOT NULL',
        'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE'
    ],
    events: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'tags TEXT NOT NULL',
        'creator INTEGER NOT NULL', // user_id, speaker
        'time_created INTEGER NOT NULL',
        'time_ended INTEGER NOT NULL',
        'title TEXT NOT NULL',
        'description TEXT NOT NULL',
        'FOREIGN KEY (creator) REFERENCES users (id) ON DELETE CASCADE'
    ],
    tags: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'name TEXT NOT NULL',
        'color TEXT NOT NULL'
    ],
    tickets: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'type INTEGER NOT NULL',
        'created INTEGER NOT NULL',
        'creator INTEGER NOT NULL',
        'closed INTEGER NOT NULL DEFAULT 0',
        'FOREIGN KEY (creator) REFERENCES users (id) ON DELETE CASCADE'
    ]
};

export default function createTables(db) {
    return Promise.all(Object.entries(tables).map(([name, columns]) => dbRun(db, `CREATE TABLE IF NOT EXISTS ${name} (${columns.join(', ')})`)));
}