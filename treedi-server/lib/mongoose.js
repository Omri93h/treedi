const mongoose = require('mongoose');
const logger = require('./logger');
const initConnection = async () => {
    const url = process.env.DB_HOST;
    const options = {
        useNewUrlParser: true, // For deprecation warnings
        // useCreateIndex: true, // For deprecation warnings
        useUnifiedTopology: true, // For deprecation warnings
        user: process.env.DB_USER,
        pass: process.env.DB_PASS
    };

    mongoose
    .connect(url, options)
    .then(() => logger.info(`connected to MongoDB online to DB : ${mongoose.connection.db.databaseName}`))
    .catch(err => logger.error(`Connection FAILD - connection error: ${err}`));
}
    
module.exports = { initConnection }
