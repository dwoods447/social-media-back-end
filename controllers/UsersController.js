const User = require('../models/User'); 
const moment = require('moment');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const secret = config.authentication.jwtSecret;



module.exports = {
    async getSingleUser(req, res, next){
        const user = {name: 'Demaria Woods'};
        return res.json({user: user});
    },

    async getAllUsers(req, res, next){
        const users = [{name: 'Demaria Woods'}, {name: 'Darrell Woods'}];
        return res.json({users: users});
    },

    async updateUser(req, res, next){
        return res.json({messagae: 'User updated'});
    },

    async deleteUser(req, res, next){
        return res.json({messagae: 'User deleted'});
    },
}