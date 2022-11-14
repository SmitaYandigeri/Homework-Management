const mysql =  require("mysql");
const dotenv = require("dotenv");

let dbInstance = null;
dotenv.config();

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DASBASE,
    port: process.env.DBPORT,
    connectionLimit: process.env.CONNECTIONLIMIT
});

  module.exports = {
    register : (data, callback) => {
        const REGISTER_QUERY = "INSERT INTO HOMEWORK.REGISTERED_USERS(FIRST_NAME, LAST_NAME, EMAIL_ID, PHONE_NUMBER," +
        " USER_PASSWORD, USER_TYPE) VALUES(?,?,?,?,?,?);";
        connection.query(REGISTER_QUERY, [data.body.firstName, data.body.lastName, data.body.emailId, data.body.phoneNumber, 
            data.body.password, data.body.userType], 
            (error, result, fields) => {
            if (error) {
                callback(error);
            }else {
                callback(null, result)
            }
        });  
    },

    login : (username, password, callback) => {
        const LOGIN_QUERY = "SELECT * FROM HOMEWORK.REGISTERED_USERS WHERE EMAIL_ID = ? AND USER_PASSWORD = ?";
        connection.query(LOGIN_QUERY, [username, password], 
            (error, result, fields) => {
            if (error) {
                callback(error);
            }else {
                callback(null, result)
            }
        });  
    }, 

    findFullName : (username, password, callback) => {
        const FIND_NAME = "SELECT FIRST_NAME, LAST_NAME FROM HOMEWORK.REGISTERED_USERS WHERE EMAIL_ID = ? AND USER_PASSWORD = ?";
        connection.query(FIND_NAME, [username, password], 
            (error, result, fields) => {
            if (error) {
                callback(error);
            }else {
                callback(null, result)
            }
        });  
    }
  };