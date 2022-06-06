const logger = require('../../lib/logger');
const config = require('../../config/config-default');
const User = require('../../config/user-model');
let message = '';


const checkId = async function(req, res, next) {
    try{
        const { id } = req.params;
        const user = await User.findById({id});
        if(!user){
            message = 'Error - User not exist';
            logger.error(message);
            return res.status(401).json({message});
        }
        else{
            logger.info(`Success - founded the User`);
            next();
        }
    }
    catch(error){
        message = 'Error - Problem find User';
        logger.error(message);
        return res.status(401).json({message});
    }
};
const getAllUsers = async function(req, res){
    try{
        logger.info('getAllUser');
        const users = await User.find();
        logger.info(`founded ${users.length} users`);
        return res.status(200).json(users);
    }
    catch(error){
        message = 'Error - Failed searching for all users';
        logger.error(`${message} + ${err}`);
        return res.status(400).json({message})
    }
};
const getUser = async function(req, res){
    try{
        const user = await User.findById({ id: req.params.id });
        logger.info(`user detail is: ${user.user_name}`);
        return res.status(200).json({user});
    }
    catch (error) {return res.status(400).json({error});}
};
const updateUser = async function(req, res){
    try{
        logger.info('updateUser');
        const user = await User.findById({ id: req.params.id });
        if (req.body.user_name) user.user_name = req.body.user_name;
        if (req.body.email) user.email = req.body.email;
        User.update({ id: user.id });
        logger.info(user);
        return res.status(200).json({user});
    }
    catch (error) {return res.status(400).json({error});}
};
const deleteUser = async function(req, res){
    try{
        logger.info('deleteUser');
        const user = await User.findById({ id: req.params.id });
        if (user.isDeleted == false) user.isDeleted = true;
        User.update({ id: user.id });
        logger.info(user);
        return res.status(200).json({user});
    }
    catch (error) {return res.status(400).json({error});}
};
module.exports =  { getAllUsers, getUser, updateUser, deleteUser, checkId };