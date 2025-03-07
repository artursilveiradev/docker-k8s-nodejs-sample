const { faker } = require('@faker-js/faker');
const db = require('../../src/persistence');
const updateItem = require('../../src/routes/update-item');

const ITEM = {
  id: faker.string.uuid(),
  name: faker.string.sample(),
  completed: faker.datatype.boolean(),
};

jest.mock('../../src/persistence', () => ({
  getItem: jest.fn(),
  updateItem: jest.fn(),
}));

test('it updates items correctly', async () => {
  const req = {
    params: { id: ITEM.id },
    body: { name: faker.string.sample(), completed: !ITEM.completed },
  };
  const res = { send: jest.fn() };

  db.getItem.mockReturnValue(Promise.resolve(ITEM));

  await updateItem(req, res);

  expect(db.updateItem.mock.calls.length).toBe(1);
  expect(db.updateItem.mock.calls[0][0]).toBe(req.params.id);
  expect(db.updateItem.mock.calls[0][1]).toEqual({
    name: req.body.name,
    completed: req.body.completed,
  });

  expect(db.getItem.mock.calls.length).toBe(1);
  expect(db.getItem.mock.calls[0][0]).toBe(req.params.id);

  expect(res.send.mock.calls[0].length).toBe(1);
  expect(res.send.mock.calls[0][0]).toEqual(ITEM);
});
