const { existsSync, unlinkSync } = require('node:fs');
const { faker } = require('@faker-js/faker');
const db = require('../../src/persistence/sqlite');

const location = process.env.SQLITE_DB_LOCATION || '/tmp/todo.db';

const ITEM = {
  id: faker.string.uuid(),
  name: faker.string.sample(),
  completed: faker.datatype.boolean(),
};

beforeEach(() => {
  if (existsSync(location)) {
    unlinkSync(location);
  }
});

test('it initializes correctly', async () => {
  await db.init();
});

test('it can store and retrieve items', async () => {
  await db.init();

  await db.storeItem(ITEM);

  const items = await db.getItems();
  expect(items.length).toBe(1);
  expect(items[0]).toEqual(ITEM);
});

test('it can update an existing item', async () => {
  await db.init();

  const initialItems = await db.getItems();
  expect(initialItems.length).toBe(0);

  await db.storeItem(ITEM);

  await db.updateItem(
    ITEM.id,
    Object.assign({}, ITEM, { completed: !ITEM.completed })
  );

  const items = await db.getItems();
  expect(items.length).toBe(1);
  expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can remove an existing item', async () => {
  await db.init();
  await db.storeItem(ITEM);

  await db.removeItem(ITEM.id);

  const items = await db.getItems();
  expect(items.length).toBe(0);
});

test('it can get a single item', async () => {
  await db.init();
  await db.storeItem(ITEM);

  const item = await db.getItem(ITEM.id);
  expect(item).toEqual(ITEM);
});
