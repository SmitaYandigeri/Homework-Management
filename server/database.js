const mysql =  require("mysql");
const dotenv = require("dotenv");

let dbInstance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DASBASE,
    port: process.env.DBPORT
});

class DBService {
        static getDBInstance() {
            return dbInstance ? dbInstance : new DBService;
        }

        async register(firstName, lastName, emailId, phoneNumber, password, userType){
            const REGISTER_USER = "INSERT INTO HOMEWORK.REGISTERED_USERS(FIRST_NAME, LAST_NAME, EMAIL_ID, PHONE_NUMBER," +
                 " USER_PASSWORD, USER_TYPE) VALUES(?,?,?,?,?,?);";
            const EXISTING_USER_CHECK = "SELECT COUNT(1) FROM  HOMEWORK.REGISTERED_USERS WHERE EMAIL_ID = ?"
            try {
                
                //To-Do - Check if User exists before registering
                const response = await new Promise((resolve, reject) => {
                    connection.query(REGISTER_USER,[firstName, lastName, emailId, phoneNumber, password, userType], function (err, result, fields) {
                        if (err) throw err;
                        resolve(result);
                    });
                  });
            } catch (error) {
                console.log(error);
            }
        }

  }
  
  module.exports = DBService;