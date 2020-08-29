const express = require("express");
const cors = require("cors");

const { v4: uuid, v4: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) { 
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: "Invalid repository ID." });
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) { 
    return res.status(400).json({ error: "Repository not found." });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  const repository = { 
    id, 
    title: title ? title : repositories[repositoryIndex].title, 
    url: url ? url : repositories[repositoryIndex].url, 
    techs: techs ? techs : repositories[repositoryIndex].techs, 
    likes: repositories[repositoryIndex].likes };

  repositories[repositoryIndex] = repository;

  response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id);

  repository.likes++;

  response.json(repository);
});

module.exports = app;
