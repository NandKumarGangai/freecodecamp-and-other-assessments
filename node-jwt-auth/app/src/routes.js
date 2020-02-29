const express = require('express');
const User = require('./tools/models/models');
const route = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../../config');
const checkToken = require('./middlewares/index');
const httpCode = require('../src/constants/httpCodes');

const salt = bcrypt.genSaltSync(10);
const fakeUser = {
    user_name: 'fakeUserName', // String is shorthand for {type: String}
    user_password: bcrypt.hashSync('fakeUserPassword', salt),
    user_date_of_birth: new Date('12/12/1995'),
    user_contact_no: '7894244569'.toString(),
    user_email: 'fakeUserMail@fake.com',
    user_date_account_created: Date.now(),
    user_admin: false,
}

const encryptPassword = (password) => bcrypt.hashSync(password, salt);
const createResponse = (status, res) => {
    return {
        status: status === httpCode.HTTP_STATUS_OK ? 'success' : 'failed',
        statusCode: status.toString(),
        body: res
    }
}
route.get('/users', (req, res) => {
    console.log('In all_users');
    User.find({})
        .then((data) => {
            console.log(data);
            if (data.length > 0)
                res.status(httpCode.HTTP_STATUS_OK).send(createResponse(httpCode.HTTP_STATUS_OK, data));
            else
                res.status(httpCode.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(createResponse(httpCode.HTTP_STATUS_INTERNAL_SERVER_ERROR, data));
        })
        .catch((err) => {
            console.log(err);
            res.status(httpCode.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(createResponse(httpCode.HTTP_STATUS_INTERNAL_SERVER_ERROR, err));
        });
});

/**
 * @argument: localhost:4000/api/user/fakeUserName
 */
route.get('/user/:user_name', checkToken.checkToken, (req, res) => {
    const userName = req.params.user_name;

    User.find({ user_name: userName })
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});

route.post('/get_user', checkToken.checkToken, (req, res) => {
    console.log('In POST /get_user');
    const {
        body: {
            user_name: userName = ''
        } = {}
    } = req;
    User.find({ user_name: userName })
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
});

route.post('/register', (req, res) => {
    const {
        body: {
            newUser = {}
        } = {}
    } = req;
    const createUser = {
        user_first_name: newUser.firstName,
        user_last_name: newUser.lastName,
        user_password: encryptPassword(newUser.password),
        user_date_of_birth: newUser.date_of_birth,
        user_contact_no: newUser.contact_number,
        user_email: newUser.email
    }
    const new_user = new User({ ...createUser, _id: new mongoose.Types.ObjectId() });
    new_user.save()
        .then((data) => {
            console.log('Record inserted...', data);
            res.send(data);
        })
        .catch((err) => {
            console.log('Error while inserting record: ', err);
            res.send(err);
        });

});

route.post('/login', (req, res) => {
    const {
        body: {
            user_name: userName = '',
            user_password: userPassword = ''
        } = {}
    } = req;
    console.log('user_name: ', userName, ' & user_password: ', userPassword);
    User.find({ user_email: userName })
        .exec()
        .then((users) => {
            console.log('users: ', users);
            if (users.length > 0) {
                if (bcrypt.compareSync(userPassword, users[0].user_password)) {
                    const token = jwt.sign({ jwtUserName: userName },
                        config.secret,
                        {
                            expiresIn: '24h',
                        });
                    res.status(httpCode.HTTP_STATUS_OK).json({
                        success: true,
                        message: 'Success',
                        token,
                        user: users[0],
                    });
                } else {
                    res.status(201).json({
                        message: 'Email or Password incorrect',
                    });
                }
            } else {
                res.status(201).json({
                    message: 'Email or Password incorrect',
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

route.put('/register', (req, res) => {
    res.end('User registration');
});

route.patch('/register', (req, res) => {
    res.end('User registration');
});

module.exports = route;