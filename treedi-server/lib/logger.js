const log = require('log-to-file');
const moment = require('moment');
const { greenBright, blueBright, redBright, yellowBright, cyanBright, grey } = require('chalk');
require('dotenv').config()

function timeStamp() {
    return moment().format('DD/MM/YYYY HH:mm:ss');
}

const logger = {
    info: function (msg) {
        //Write Info to log
        console.log(`${greenBright('info:')} ${grey(timeStamp())} ${msg}`);
        //Write Info to defualt.log
        log("Info : " + msg + '\n', process.env.logFile);
    },
    error: function (msg) {
        //Write Error to log
        console.log(`${redBright('error:')} ${grey(timeStamp())} ${msg}`);
        //Write Error to defualt.log
        log("Error : " + msg + '\n', process.env.logFile);
    },
    http: function (msg) {
        //Write Http request to log
        console.log(`${cyanBright('http:')} ${grey(timeStamp())} ${msg}`);
        //Write Http request to defualt.log
        log("Http : " + msg + '\n', process.env.logFile);
    },
    warn: function (msg) {
        //Write Warn request to log
        console.log(`${yellowBright('warn:')} ${grey(timeStamp())} ${msg}`);
        //Write Warn request to defualt.log
        log("Warn : " + msg + '\n', process.env.logFile);
    },
    debug: function (msg) {
        //Write Debug request to log
        console.log(`${blueBright('debug:')} ${grey(timeStamp())} ${msg}`);
        //Write Debug request to defualt.log
        log("Debug : " + msg + '\n', process.env.logFile);

    }
};

module.exports = logger;