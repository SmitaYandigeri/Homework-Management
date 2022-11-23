const mysql =  require("mysql");
const dotenv = require("dotenv");
const moment = require("moment");

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
    },

    addClass : (data, user , callback)=>{
        const ADDCLASS_QUERY= "INSERT INTO HOMEWORK.CLASS(TEACHER_EMAIL_ID, TEACHER_NAME, CLASS_NAME, CLASS_CODE, CREATE_TS)" +
        "VALUES(?,?,?,?,?);";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var teacherFullName = user.FIRST_NAME + user.LAST_NAME;
        connection.query(ADDCLASS_QUERY, [user.EMAIL_ID, teacherFullName, data.body.className, data.body.classCode, 
            createTs],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    },

    updateClass : (data, user , callback)=>{
        const ADDCLASS_QUERY= "UPDATE HOMEWORK.CLASS SET CLASS_NAME = ?, CLASS_CODE=?, CREATE_TS =? WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE = ?;";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        
        connection.query(ADDCLASS_QUERY, [data.body.className, data.body.classCode, createTs, user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    },

    deleteClass : (data, user , callback)=>{
        const ADDCLASS_QUERY= "DELETE FROM HOMEWORK.CLASS WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE = ?;";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        
        connection.query(ADDCLASS_QUERY, [user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    },

    getClassesForTeacher : (user, callback) => {
        const CLASSES_FOR_TEACHER = "SELECT * FROM HOMEWORK.CLASS WHERE TEACHER_EMAIL_ID = ? ORDER BY CREATE_TS";
        connection.query(CLASSES_FOR_TEACHER, [user.EMAIL_ID],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                }else {
                    callback(null, result)
                }
        });
    }

  };