const { faker } = require('@faker-js/faker');
const db = require('../../src/persistence');
const deleteItem = require('../../src/routes/delete-item');

jest.mock('../../src/persistence', () => ({
  removeItem: jest.fn(),
  getItem: jest.fn(),
}));

test('it removes item correctly', async () => {
  const req = { params: { id: faker.string.uuid() } };
  const res = { sendStatus: jest.fn() };

  await deleteItem(req, res);

  expect(db.removeItem.mock.calls.length).toBe(1);
  expect(db.removeItem.mock.calls[0][0]).toBe(req.params.id);
  expect(res.sendStatus.mock.calls[0].length).toBe(1);
  expect(res.sendStatus.mock.calls[0][0]).toBe(200);
});
