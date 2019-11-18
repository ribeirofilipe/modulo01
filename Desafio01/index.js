const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
var requests = 0;

function requestsCount(req, res, next) {
  requests += 1;

  console.log(`Total de requisições até o momento: ${requests}`)

  return next();
};

function checkRequiredParameters(req, res, next) {
  const { id, title } = req.body;
  
  if (!id || !title)
    return res.status(400).send({ error: "Id and Title are requireds." });

  req.project = { id, title };

  return next();
};

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(x => x.id === id);

  if (!project)
    return res.status(404).send({ error: "Project not found." });

  req.project = project;

  return next();
};

function checkTaskIsNotEmpty(req, res, next) {
  const { title } = req.body;

  if (!title)
    return res.status(400).send({ error: "Forless one task is required." });

  req.title = title;

  return next();
};

server.get('/projects', requestsCount, (req, res) => {
  if (projects.length === 0)
    return res.json({message: "The projects array is empty."});

  return res.json(projects);
})

server.post('/projects', requestsCount, checkRequiredParameters, (req, res) => {
  projects.push(req.project);

  return res.sendStatus(201);
});

server.post('/projects/:id/tasks', requestsCount, checkProjectExists, checkTaskIsNotEmpty, (req, res) => {
  req.project.tasks = [...req.project.tasks || [], req.title];

  return res.send(req.project);
});

server.put('/projects/:id', requestsCount, checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.sendStatus(200);
});

server.delete('/projects/:id', requestsCount, checkProjectExists, (req, res) => {
  const index = projects.findIndex(x => x.id === req.project.id);

  projects.splice(index, 1);

  return res.sendStatus(200);
});
 
server.listen(3000);