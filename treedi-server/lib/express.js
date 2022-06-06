const express = require('express');
const helmet = require('helmet');
const app = express();
const glob = require('glob');
const path = require('path');
const cors = require('cors');
// const compression = require('compression');
const bodyParser = require('body-parser')
const defaultRoutes = require('../api/routes/default-route');
const logger = require('./logger');

// Parser
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({limit: '5MB',extended: true, parameterLimit:50000}));
app.use(express.json());
app.use(express.urlencoded());

function initGlobRouter(){
    const getGlobbedpaths = globPattern => glob.sync(globPattern);
    //Get all the Valid routes with the extantion -route.js from the folder routes
    const serverRoutes = getGlobbedpaths('api/routes/*-route.js');
    serverRoutes.forEach(tempPath => {
        const route = require(path.resolve(tempPath));
        if(tempPath != 'api/routes/default-route.js') 
            //use all the routes
            app.use(route);
    });
    //add the defualt ratue
    app.use(defaultRoutes);
}
initGlobRouter();

module.exports = app;