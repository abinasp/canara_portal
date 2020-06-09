const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes/route');

const app = express();

app.use(cors());
app.use(bodyParser({ limit: '50mb' }));
app.use('/api', routes);

app.listen(8001,err=>{
    err ? console.log('Failed to start server')
        : console.log('Server is running in 8001')
});