import { dbRun } from './db.js';

const tables = {
    users: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'role INTEGER NOT NULL DEFAULT 0', // 0 - user, 1 - resident, 2 - moderator
        'email TEXT',
        'password TEXT',
        'first_name TEXT NOT NULL',
        'second_name TEXT NOT NULL',
        'third_name TEXT',
        'country TEXT NOT NULL',
        'city TEXT NOT NULL',
        'telegram INTEGER'
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
        'title TEXT NOT NULL',
        'description TEXT NOT NULL',
        'time INTEGER NOT NULL',
        'duration INTEGER NOT NULL',
        'location TEXT NOT NULL',
        'creator INTEGER NOT NULL', // user_id, speaker
        'confirmed INTEGER NOT NULL DEFAULT 0',
        'accepted INTEGER NOT NULL DEFAULT 0',
        'FOREIGN KEY (creator) REFERENCES users (id) ON DELETE CASCADE'
    ],
    event_tags: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'event_id INTEGER NOT NULL',
        'tag_id INTEGER NOT NULL',
        'FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE',
        'FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE'
    ],
    event_users: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'event_id INTEGER NOT NULL',
        'user_id INTEGER NOT NULL',
        'FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE',
        'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE'
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
    ],
    telegram_auth: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'type INTEGER NOT NULL', // 0 - login, 1 - registration
        'code TEXT NOT NULL',
        'telegram INTEGER',
        'expires INTEGER NOT NULL'
    ]
};

export default function createTables(db) {
    return Promise.all(Object.entries(tables).map(([name, columns]) => dbRun(db, `CREATE TABLE IF NOT EXISTS ${name} (${columns.join(', ')})`)));
}