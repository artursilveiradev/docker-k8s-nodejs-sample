const { faker } = require('@faker-js/faker');
const db = require('../../src/persistence');
const getItems = require('../../src/routes/get-items');

const ITEMS = [
  {
    id: faker.string.uuid(),
    name: faker.string.sample(),
    completed: faker.datatype.boolean(),
  },
];

jest.mock('../../src/persistence', () => ({
  getItems: jest.fn(),
}));

test('it gets items correctly', async () => {
  const req = {};
  const res = { send: jest.fn() };
  db.getItems.mockReturnValue(Promise.resolve(ITEMS));

  await getItems(req, res);

  expect(db.getItems.mock.calls.length).toBe(1);
  expect(res.send.mock.calls[0].length).toBe(1);
  expect(res.send.mock.calls[0][0]).toEqual(ITEMS);
});
