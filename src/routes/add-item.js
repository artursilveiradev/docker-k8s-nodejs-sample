const { randomUUID } = require('node:crypto');
const db = require('../persistence');

module.exports = async (req, res) => {
  const item = {
    id: randomUUID(),
    name: req.body.name,
    completed: false,
  };

  await db.storeItem(item);
  res.send(item);
};
