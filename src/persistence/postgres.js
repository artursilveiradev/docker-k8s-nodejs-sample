const { readFileSync } = require('node:fs');
const { Client } = require('pg');
const waitPort = require('wait-port');

const {
  POSTGRES_HOST: HOST,
  POSTGRES_HOST_FILE: HOST_FILE,
  POSTGRES_USER: USER,
  POSTGRES_USER_FILE: USER_FILE,
  POSTGRES_PASSWORD: PASSWORD,
  POSTGRES_PASSWORD_FILE: PASSWORD_FILE,
  POSTGRES_DB: DB,
  POSTGRES_DB_FILE: DB_FILE,
} = process.env;

let client;

async function init() {
  const host = HOST_FILE ? readFileSync(HOST_FILE) : HOST;
  const user = USER_FILE ? readFileSync(USER_FILE) : USER;
  const password = PASSWORD_FILE
    ? readFileSync(PASSWORD_FILE, 'utf8')
    : PASSWORD;
  const database = DB_FILE ? readFileSync(DB_FILE) : DB;

  await waitPort({
    host,
    port: 5432,
    timeout: 10000,
    waitForDns: true,
  });

  client = new Client({
    host,
    user,
    password,
    database,
  });

  return client
    .connect()
    .then(async () => {
      console.log(`Connected to postgres db at host ${HOST}`);
      await client.query(
        'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)'
      );
      console.log(
        'Connected to db and created table todo_items if it did not exist'
      );
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}

async function teardown() {
  return client
    .end()
    .then(() => {
      console.log('Client ended');
    })
    .catch((err) => {
      console.error('Unable to end client:', err);
    });
}

async function getItems() {
  return client
    .query('SELECT * FROM todo_items')
    .then((res) => {
      return res.rows.map((row) => ({
        id: row.id,
        name: row.name,
        completed: row.completed,
      }));
    })
    .catch((err) => {
      console.error('Unable to get items:', err);
    });
}

async function getItem(id) {
  return client
    .query('SELECT * FROM todo_items WHERE id = $1', [id])
    .then((res) => {
      return res.rows.length > 0 ? res.rows[0] : null;
    })
    .catch((err) => {
      console.error('Unable to get item:', err);
    });
}

async function storeItem(item) {
  return client
    .query('INSERT INTO todo_items(id, name, completed) VALUES($1, $2, $3)', [
      item.id,
      item.name,
      item.completed,
    ])
    .then(() => {
      console.log('Stored item:', item);
    })
    .catch((err) => {
      console.error('Unable to store item:', err);
    });
}

async function updateItem(id, item) {
  return client
    .query('UPDATE todo_items SET name = $1, completed = $2 WHERE id = $3', [
      item.name,
      item.completed,
      id,
    ])
    .then(() => {
      console.log('Updated item:', item);
    })
    .catch((err) => {
      console.error('Unable to update item:', err);
    });
}

async function removeItem(id) {
  return client
    .query('DELETE FROM todo_items WHERE id = $1', [id])
    .then(() => {
      console.log('Removed item:', id);
    })
    .catch((err) => {
      console.error('Unable to remove item:', err);
    });
}

module.exports = {
  init,
  teardown,
  getItems,
  getItem,
  storeItem,
  updateItem,
  removeItem,
};
