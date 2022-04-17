const log = require('log-to-file');
const moment = require('moment');
const { greenBright, blueBright, redBright, yellowBright, cyanBright, grey } = require('chalk');
require('dotenv').config()

function timeStamp() {
    return moment().format('DD/MM/YYYY HH:mm:ss');
}


const logger = {
    info: function (msg) {
        console.log(`${greenBright('info:')} ${grey(timeStamp())} ${msg}`);
    },
    error: function (msg) {
        console.log(`${redBright('error:')} ${grey(timeStamp())} ${msg}`);
        log("Error : " + msg + '\n', process.env.logFile);
    },
    http: function (msg) {
        console.log(`${cyanBright('http:')} ${grey(timeStamp())} ${msg}`);
    },
    warn: function (msg) {
        console.log(`${yellowBright('warn:')} ${grey(timeStamp())} ${msg}`);
        log("Warn : " + msg + '\n', process.env.logFile);
    },
    debug: function (msg) {
        console.log(`${blueBright('debug:')} ${grey(timeStamp())} ${msg}`);
    }
};


module.exports = logger;