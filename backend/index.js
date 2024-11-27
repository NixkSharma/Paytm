const express = require('express');
const apiRouter = require('./routes/index');
const app = express();


app.use('/api/v1', apiRouter);

