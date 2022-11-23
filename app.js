const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { request, response, application } = require("express");
const { register, login, findFullName , addClass, updateClass, deleteClass, getClassesForTeacher} = require("./database")
const bodyParser = require("body-parser");
const e = require("express");
const session = require("express-session");
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

//Starts the Application On Port 5000
app.listen(+process.env.PORT , () => {
    console.log("Server Started On :: "+process.env.PORT);
});

app.use(session({
     secret: process.env.SESSION_KEY,
     resave: false,
     saveUninitialized: false
    })
)

//render home page
app.get("/", (request, response) => {
    response.sendFile('index.html', {root: __dirname+'/views'});
})

//Hosts the Login API
app.post("/api/login", function(request,response){
    var username = request.body.loginEmailId;
    var password = request.body.loginPassword;
    console.log(username, password)
    login(username, password, (error, result) => {
        if (error) {
            response.end();
            console.log("failed To Return Data")
            return error;
        } else {
            var registeredUser = JSON.parse(JSON.stringify(result));
            console.log(registeredUser)
            if(registeredUser.length == 1) {
                const user = registeredUser[0];

                if (user.USER_TYPE == 'Teacher') {
                    console.log("Redirecting To Teacher Screen");
                    request.session.user = user;
                    request.session.save();
                    response.redirect(307, "/api/teacher");
                } else if (user.USER_TYPE == 'Student'){
                    console.log("Redirecting To Student Screen");
                    request.session.user = user;
                    request.session.save();
                    response.redirect(307, "/api/student");
                } else {
                    response.sendFile('403.html', {root: __dirname+'/views'});
                }
            } else {
                response.sendFile('403.html', {root: __dirname+'/views'});
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
app.post('/api/addclass', (request, response) => {
    console.log('Processing AddClass Request...');
    console.log(request.body);
    if (request.session.user) {
        addClass(request, request.session.user, (error, result) => {
            if (error) {
                console.log(error);
                if (error.code == "ER_DUP_ENTRY" )
                return response.json({
                    status: 'error',
                    error: 'Class Name, Already Exist'
                });
                throw error;
            }
            return response.json({status:'ok'});
        });
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.post('/api/updateclass', (request, response) => {
    console.log('Processing AddClass Request...');
    console.log(request.body);
    if (request.session.user) {
        updateClass(request, request.session.user, (error, result) => {
            if (error) {
                console.log(error);
                if (error.code == "ER_DUP_ENTRY" )
                return response.json({
                    status: 'error',
                    error: 'Class Name, Already Exist'
                });
                throw error;
            }
            return response.json({status:'ok'});
        });
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.post('/api/deleteclass', (request, response) => {
    console.log('Processing deleteClass Request...');
    console.log(request.body);
    if (request.session.user) {
        deleteClass(request, request.session.user, (error, result) => {
            if (error) {
                console.log(error);
                if (error.code == "ER_DUP_ENTRY" )
                return response.json({
                    status: 'error',
                    error: 'Class Name, Already Exist'
                });
                throw error;
            }
            return response.json({status:'ok'});
        });
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.post("/api/teacher", (request, response) => {
    if (request.session.user){
        console.log(request.body)
        var username = request.body.loginEmailId;
        var password = request.body.loginPassword;
        findFullName(username, password, (error, result) => {
            if (error) {
                return error;
            } else {
                var registeredUser = JSON.parse(JSON.stringify(result));
                console.log(registeredUser);
                var fullName = registeredUser[0].FIRST_NAME +"  "+ registeredUser[0].LAST_NAME;
                response.render('teacher-Home', {name : fullName});
            }
        })
    } else  {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/teacher", (request, response) => {
    response.sendFile('403.html', {root: __dirname+'/views'});
})

app.post("/api/student", (request, response) => {
    console.log(request.body)
    var username = request.body.loginEmailId;
    var password = request.body.loginPassword;
    if (request.session.user){
        findFullName(username, password, (error, result) => {
            if (error) {
                return error;
            } else {
                var registeredUser = JSON.parse(JSON.stringify(result));
                console.log(registeredUser);
                var fullName = registeredUser[0].FIRST_NAME +"  "+ registeredUser[0].LAST_NAME;
                response.render('student', {name : fullName});
            }
        })
    } else  {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/student", (request, response) => {
    response.sendFile('403.html', {root: __dirname+'/views'});
})

app.get("/api/logout",(request, response) => {
    request.session.destroy();
    response.redirect("/")
})

app.get("/api/profile", (request, response) => {
    if (request.session.user){
        response.render('teacher-profile');
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/class", (request, response) => {
    if (request.session.user){
        console.log("rendering classes ")
        getClassesForTeacher(request.session.user, (error, result) => {
            if (error) {
                response.end();
                console.log("failed To Return Data")
                return error;
            } else {
                var registeredUser = JSON.parse(JSON.stringify(result));
                console.log(registeredUser)
                response.render('teacher-class', {classes : registeredUser})
            }
        });
        
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.post("/api/class", (request, response) => {
    if (request.session.user){
        console.log("rendering classes ")
        getClassesForTeacher(request.session.user, (error, result) => {
            if (error) {
                response.end();
                console.log("failed To Return Data")
                return error;
            } else {
                var registeredUser = JSON.parse(JSON.stringify(result));
                console.log(registeredUser)
                response.render('teacher-class', {classes : registeredUser})
            }
        });
        
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/homework", (request, response) => {
    if (request.session.user){
        var homework = [];
        response.render('teacher-homework', {homework:homework});
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/schedule", (request, response) => {
    if (request.session.user){
        response.render('teacher-schedule');
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/refresh", function(request,response){
    if (request.session.user){
        var user = request.session.user;
        if (user.USER_TYPE == 'Teacher') {
            console.log("Refreshing Teacher Screen");
            response.redirect(307, "/api/teacher");
        } else if (user.USER_TYPE == 'Student'){
            console.log("Refreshing Student Screen");
            response.redirect(307, "/api/student");
        } else {
            response.sendFile('403.html', {root: __dirname+'/views'});
        }
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})