const dotenv =  require('dotenv');
dotenv.config();

// enviroment vatiable
const config = {
    LOGFILE: process.env.logFile,
    CS: process.env.CS,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    OPTIONS: process.env.options,
    URL_ID: process.env.urlIMDBid,
    URL_FILM: process.env.urlIMDBFilm,
    X_KEY: process.env.xrapidapikey,
    X_HOST: process.env.xrapidapihost,
    MONGOLAB_URI: process.env.MONGOLAB_URI
}


module.exports = config;