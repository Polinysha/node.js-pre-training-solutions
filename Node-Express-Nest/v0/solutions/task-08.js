const express = require('express');
const path = require('path');

function setupStaticFiles(app) {

  const publicDir = path.join(__dirname, 'public');
  app.use('/static', express.static(publicDir));
}

module.exports = setupStaticFiles;
