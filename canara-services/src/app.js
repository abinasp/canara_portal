const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv/config");

const routes = require('./routes/route');
const {SERVER_PORT} = process.env;
const app = express();

app.use(cors());
app.use(bodyParser({ limit: '50mb' }));
app.use('/api', routes);

app.listen(SERVER_PORT ? SERVER_PORT : 8001,err=>{
    err ? console.log('Failed to start server')
        : console.log('Server is running in 8001')
});