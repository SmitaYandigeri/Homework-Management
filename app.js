const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { request, response } = require("express");
const { register, login } = require("./database")
const bodyParser = require("body-parser");
const e = require("express");
const encoder=bodyParser.urlencoded();


dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');

//Static Files
app.use(express.static(__dirname));
app.use('css', express.static(__dirname+'/client/asset/style'));
app.use('img', express.static(__dirname+'/client/asset/img'));
app.use('js', express.static(__dirname+'/client/js'));
app.set('view engine', 'ejs');

//Starts the Application On Port 5000
app.listen(+process.env.PORT , () => {
    console.log("Server Started On :: "+process.env.PORT);
});

//render home page
app.get("/", (request, response) => {
    response.sendFile('index.html', {root: __dirname+'/views'});
})

app.get("/api/teacher", (request, response) => {
    response.sendFile(__dirname + "/views/teacher.html");
})

app.get("/api/student", (request, response) => {
    response.sendFile('student.html', {root: __dirname+'/views'});
})

app.get("/api/failed", (request, response) => {
    response.send("<h1>User Does Not Exist, Please Sign Up From Home Page<h1>");
})

//Hosts the Login API
app.post("/api/login", function(request,response){
    var username = request.body.loginEmailId;
    var password = request.body.loginPassword;
    console.log(username, password)
    login(username, password, (error, result) => {
        if (error) {
            return error;
        } else {
            var registeredUser = JSON.parse(JSON.stringify(result));
            console.log(registeredUser);
            console.log(registeredUser.length);
            
            if(registeredUser.length == 1 && registeredUser[0].USER_TYPE == 'Teacher') {
                console.log("Redirecting To Teacher Screen");
                var name1=registeredUser[0].FIRST_NAME +' '+ registeredUser[0].LAST_NAME;
                response.render('teacher', {name:name1});
            } else if (registeredUser.length == 1 && registeredUser[0].USER_TYPE == 'Student') {
                response.redirect("/api/student");
            } else {
                response.redirect("/api/failed");
            }
        }
    });
})

app.post('/api/register', (request, response) => {
    console.log('Processing Register Request...');
    console.log(request.body);
    
    register(request, (error, result) => {
        if (error) {
            console.log(error);
            if (error.code == "ER_DUP_ENTRY" )
            return response.json({
                status: 'error',
                error: 'User Already Exists, try to Login'
            });
            throw error;
        }

        console.log(result)
        return response.json({status:'ok'});
    });
})