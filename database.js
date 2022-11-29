const mysql =  require("mysql");
const dotenv = require("dotenv");
const moment = require("moment");
const { request } = require("express");
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
        const ADDCLASS_QUERY= "UPDATE HOMEWORK.CLASS SET CLASS_NAME = ?, CLASS_CODE=? WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE = ?;";
        
        connection.query(ADDCLASS_QUERY, [data.body.className, data.body.classCode, user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    },

    deleteClass : (data, user , callback)=>{
        const DELETE_CLASS_QUERY= "DELETE FROM HOMEWORK.CLASS WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE = ?;";
        const DELETE_HOMEWORK_QUERY= "DELETE FROM HOMEWORK.T_HOMEWORKS WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE = ?;";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        
        connection.query(DELETE_CLASS_QUERY, [user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } 
        });
        connection.query(DELETE_HOMEWORK_QUERY, [user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
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
    },
    
    addTeacherHomework : (data, user , callback)=>{
        const ADD_TEACHER_HOMEWORK_QUERY= "INSERT INTO HOMEWORK.T_HOMEWORKS(TEACHER_EMAIL_ID, INVITATION_CODE, HW_NAME, "+ 
            "HW_DUE_DT, HW_DESCRIPTION,HW_FILE_NAME, HW_FILE_DATA,  CREATE_TS) VALUES(?,?,?,?,?,?,?,?);";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        connection.query(ADD_TEACHER_HOMEWORK_QUERY, [user.EMAIL_ID, data.body.invitationCode, data.body.hwName, 
            data.body.hwDueDate,  data.body.hwDescription, data.body.fileName, data.body.fileData, createTs],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    },
    getHomeWorksForClass : (invitationCode, user , callback)=>{
        const FETCH_HOMEWORKS_BY_INVITITION = "SELECT * FROM HOMEWORK.T_HOMEWORKS WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE=? ORDER BY CREATE_TS;";
        connection.query(FETCH_HOMEWORKS_BY_INVITITION, [user.EMAIL_ID, invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    }, 

    updateHomework : (data, user , callback)=>{
        const UPDATE_HW_WITH_NO_FILE = "UPDATE HOMEWORK.T_HOMEWORKS SET HW_NAME = ?, HW_DUE_DT=?, HW_DESCRIPTION=? WHERE TEACHER_EMAIL_ID = ? " +
        "AND INVITATION_CODE = ? AND HW_ID = ?;";
        
        const UPDATE_HW_WITH_FILE = "UPDATE HOMEWORK.T_HOMEWORKS SET HW_NAME = ?, HW_DUE_DT=?, HW_DESCRIPTION= ?, " +
        " HW_FILE_NAME = ?, HW_FILE_DATA = ? WHERE TEACHER_EMAIL_ID = ? " +
        "AND INVITATION_CODE = ? AND HW_ID = ?;";
        

        if (data.body.fileName && data.body.fileData) {
            connection.query(UPDATE_HW_WITH_FILE, [data.body.newHwName, data.body.newHwDueDate, data.body.newHwDescription, 
                data.body.fileName, data.body.fileData, user.EMAIL_ID, data.body.invitationCode, data.body.hwID],
                (error, result, fields) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, result)
                    }
            });
        } else {
            connection.query(UPDATE_HW_WITH_NO_FILE, [data.body.newHwName, data.body.newHwDueDate, data.body.newHwDescription, user.EMAIL_ID, 
                data.body.invitationCode, data.body.hwID],
                (error, result, fields) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, result)
                    }
            });
        }
    },

    deleteHomework : (data, user , callback)=>{
        const DELETE_HOMEWORK_QUERY= "DELETE FROM HOMEWORK.T_HOMEWORKS WHERE TEACHER_EMAIL_ID = ? AND INVITATION_CODE = ? AND HW_NAME = ?;";    
        connection.query(DELETE_HOMEWORK_QUERY, [user.EMAIL_ID, data.body.invitationCode, data.body.hwName],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } 
        });
    },

    getClassesForStudent : (user, callback) => {
        const CLASSES_FOR_STUDNET = "SELECT * FROM HOMEWORK.S_CLASS WHERE STUDENT_EMAIL_ID = ? ORDER BY CREATE_TS";
        connection.query(CLASSES_FOR_STUDNET, [user.EMAIL_ID],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                }else {
                    callback(null, result)
                }
        });
    },

    joinClassForStudent : (data, user , callback)=>{
        const ADDCLASS_QUERY= "INSERT INTO HOMEWORK.S_CLASS(STUDENT_EMAIL_ID, CLASS_NAME, CLASS_CODE, INVITATION_CODE, CREATE_TS) " +
        "SELECT ?, TC.CLASS_NAME, TC.CLASS_CODE, TC.INVITATION_CODE, TC.CREATE_TS FROM HOMEWORK.CLASS TC WHERE TC.INVITATION_CODE = ?;";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var teacherFullName = user.FIRST_NAME + user.LAST_NAME;
        connection.query(ADDCLASS_QUERY, [user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    },

    getHomeWorksForClassByStudent : (invitationCode, user , callback)=>{
        const FETCH_HOMEWORKS_BY_INVITITION = "SELECT SH.*, SS.SUB_FILE_DATA FROM HOMEWORK.T_HOMEWORKS SH" +
        " LEFT JOIN HOMEWORK.S_SUBMISSIONS SS ON SH.HW_ID = SS.HW_ID AND SS.INVITATION_CODE = SH.INVITATION_CODE " +
        " WHERE SH.INVITATION_CODE=? ORDER BY SH.CREATE_TS;";
        connection.query(FETCH_HOMEWORKS_BY_INVITITION, [invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result)
                }
        });
    }, 

    dropClassForStudent : (data, user , callback)=>{
        const DELETE_CLASS_QUERY= "DELETE FROM HOMEWORK.S_CLASS WHERE STUDENT_EMAIL_ID = ? AND INVITATION_CODE = ?;";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        
        connection.query(DELETE_CLASS_QUERY, [user.EMAIL_ID, data.body.invitationCode],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } 
        });
    },

    addHomeworkSubmission : (data, user , callback)=>{
        const ADD_SUBMISSION= "INSERT INTO HOMEWORK.S_SUBMISSIONS VALUES (?,?,?,?,?,?,?)";
        const createTs = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var studentFullName = user.FIRST_NAME + user.LAST_NAME;
        connection.query(ADD_SUBMISSION, [user.EMAIL_ID, studentFullName, data.body.invitationCode, data.body.hwID,
            data.body.fileName, data.body.fileData, createTs],
            (error, result, fields) => {
                if (error) {
                    callback(error);
                } 
        });
    },
  };