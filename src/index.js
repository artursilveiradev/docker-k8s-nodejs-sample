const express = require('express');
const db = require('./persistence');
const addItem = require('./routes/add-item');
const deleteItem = require('./routes/delete-item');
const getItems = require('./routes/get-items');
const updateItem = require('./routes/update-item');

const app = express();

app.use(express.json());

app.post('/items', addItem);
app.delete('/items/:id', deleteItem);
app.get('/items', getItems);
app.put('/items/:id', updateItem);

db.init()
  .then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const gracefulShutdown = () => {
  db.teardown()
    .catch(() => {})
    .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
