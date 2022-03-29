'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();

const dbFile = __dirname + "/src/db.db";
//const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database(dbFile);

const buildSchemas = require('./src/schemas2');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app2')(db);

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});
