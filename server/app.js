const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { request, response } = require("express");
const DBService = require("./database");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(process.env.PORT , () => {
    console.log("Server Started On :: "+process.env.PORT)
});

app.get('/login', (request, response) => {
    response.render("teacher.html");
   console.log('Processing Login Request...');
    
    response.json({
        success:true
    })
  
});

app.post('/register', (request, response) => {
    console.log('Processing Register Request...');
    let error = [];
    console.log(request.body);
    const {firstName, lastName, emailId, phoneNumber, password, userType} = request.body;

    const db = DBService.getDBInstance();
    db.register(firstName, lastName, emailId, phoneNumber, password, userType);
    

    response.json({
        success:true
    });
});