const { randomUUID } = require('node:crypto');
const { faker } = require('@faker-js/faker');
const db = require('../../src/persistence');
const addItem = require('../../src/routes/add-item');

jest.mock('node:crypto', () => ({ randomUUID: jest.fn() }));

jest.mock('../../src/persistence', () => ({
  removeItem: jest.fn(),
  storeItem: jest.fn(),
  getItem: jest.fn(),
}));

test('it stores item correctly', async () => {
  const id = faker.string.uuid();
  const name = faker.string.sample();
  const req = { body: { name } };
  const res = { send: jest.fn() };

  randomUUID.mockReturnValue(id);

  await addItem(req, res);

  const expectedItem = { id, name, completed: false };

  expect(db.storeItem.mock.calls.length).toBe(1);
  expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
  expect(res.send.mock.calls[0].length).toBe(1);
  expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});
