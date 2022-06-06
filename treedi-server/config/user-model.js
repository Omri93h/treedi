const mongoose = require('mongoose');
const logger = require('../lib/logger');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, require: true, unique: true },
    token: { type: Object, require: true },
},{ collection: 'treedi_users'});


userSchema.pre('save', next => {
    logger.info('prepring for save');
    return next();
});

let User = module.exports = mongoose.model('User', userSchema);