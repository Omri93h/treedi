const express = require('express');
const helmet = require('helmet');
const app = express();
const glob = require('glob');
const path = require('path');
const cors = require('cors');

const defaultRoutes = require('../api/routes/default-route');
const logger = require('./logger');

// Parser
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

function initGlobRouter(){
    const getGlobbedpaths = globPattern => glob.sync(globPattern);
    const serverRoutes = getGlobbedpaths('api/routes/*-route.js');
    serverRoutes.forEach(tempPath => {
        logger.debug(tempPath);
        const route = require(path.resolve(tempPath));
        if(tempPath != 'api/routes/default-route.js') 
            app.use(route);
    });
    app.use(defaultRoutes);
}

initGlobRouter();

module.exports = app;