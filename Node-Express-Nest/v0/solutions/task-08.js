// Express.js static files serving for ToDo frontend
const express = require('express');
const path = require('path');

function setupStaticFiles(app) {
  // ТОЧНО как в задании: Serve static files from a `public` directory at `/static`
  const publicDir = path.join(__dirname, 'public');
  app.use('/static', express.static(publicDir));
}

module.exports = setupStaticFiles;
