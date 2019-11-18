const express = require('express');

const server = express();

server.use(express.json());

const users = ['Filipe', 'Wesley', 'Danilo', 'Fernando', 'Lucas', 'Felipe'];

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user)
    return res.status(404).json({ error: "User not found" })

  req.user = user;

  return next();
};

function checkUserExists(req, res, next) {

  if (!req.body.name)
    return res.status(400).json({ error: "Name is required" })

  return next();
};

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);
  
  return res.json(users);
});

server.put('/users/:index', (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send(200);
});

server.listen(3000);