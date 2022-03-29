'use strict';

module.exports = (db) => {
    const createRideTableSchema = `
        CREATE TABLE IF NOT EXISTS user
        (
        userID INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        bdate DATETIME,
        location TEXT NOT NULL,
        yearprocessed INTEGER
        )
    `;

    db.run(createRideTableSchema);

    return db;
};
