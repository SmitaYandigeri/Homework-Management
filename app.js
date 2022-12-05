/*
* Developed By : Yandigeri, Smita 
* This class starts server on 5000 port and host API for DB interaction
*/

const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { request, response, application } = require("express");
const { register, login, 
    addClass, updateClass, deleteClass, getClassesForTeacher, 
    addTeacherHomework, getHomeWorksForClass, deleteHomework, updateHomework, 
    getClassesForStudent, joinClassForStudent, getHomeWorksForClassByStudent, dropClassForStudent, addHomeworkSubmission, getSubmissionForHomework} = require("./database")
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

app.post('/api/addhomework', (request, response) => {
    console.log('Processing addHomework Request...');
    console.log(request.body);
    if (request.session.user) {
        addTeacherHomework(request, request.session.user, (error, result) => {
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
    console.log('Processing update Class Request...');
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

app.post('/api/updatehomework', (request, response) => {
    console.log('Processing UpdateHomework Request...');
    console.log(request.body);
    if (request.session.user) {
        updateHomework(request, request.session.user, (error, result) => {
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

app.post('/api/deletehomework', (request, response) => {
    console.log('Processing deleteHomework Request');
    console.log(request.body);
    if (request.session.user) {
        deleteHomework(request, request.session.user, (error, result) => {
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
        response.render('teacher-home');
    } else  {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/teacher", (request, response) => {
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
        var homeworks = [];
        console.log(request.query)
        var className = request.query.className;
        var invitationCode = request.query.invitationCode;

        if (invitationCode) {
            getHomeWorksForClass(invitationCode, request.session.user, (error, result) => {
                if (error) {
                    response.end();
                    console.log("failed To Return Data")
                    return error;
                } else {
                    homeworks = JSON.parse(JSON.stringify(result));
                    console.log(homeworks)
                    response.render('teacher-homework', {homeworks:homeworks, className:className, invitationCode:invitationCode});
                }
            });
        } else {
            response.render('teacher-homework', {homeworks:homeworks, className:className, invitationCode:invitationCode});
        }
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/submission", (request, response) => {
    if (request.session.user){
        var submissions;
        console.log(request.query)
        var invitationCode = request.query.invitationCode;
        var hwID = request.query.hwID;

        if (invitationCode && hwID) {
            getSubmissionForHomework(invitationCode, hwID, (error, result) => {
                if (error) {
                    response.end();
                    console.log("failed To Return Data")
                    return error;
                } else {
                    submissions = JSON.parse(JSON.stringify(result));
                    console.log(submissions)
                    response.render('teacher-submission', {submissions:submissions});
                }
            });
        } else {
            response.render('teacher-submission', {submissions:submissions});
        }    

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

app.post("/api/student", (request, response) => { 
    console.log("Rendering Student Home...")
    if (request.session.user){
        response.render('student-home');
    } else  {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }    
})

app.get("/api/student", (request, response) => {
    response.sendFile('403.html', {root: __dirname+'/views'});
})

app.get("/api/student-profile", (request, response) => {
    console.log("Rendering Student Profile...")
    if (request.session.user){
        response.render('student-profile');
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/student-class", (request, response) => {
    if (request.session.user){
        console.log("rendering classes ")
        getClassesForStudent(request.session.user, (error, result) => {
            if (error) {
                response.end();
                console.log("failed To Return Data")
                return error;
            } else {
                var registeredUser = JSON.parse(JSON.stringify(result));
                console.log(registeredUser)
                response.render('student-class', {classes : registeredUser})
            }
        });
        
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.get("/api/student-homework", (request, response) => {
    console.log("Rendering Student Homework...")
    if (request.session.user){
        var homeworks = [];
        console.log(request.query)
        var className = request.query.className;
        var invitationCode = request.query.invitationCode;
        if (invitationCode) {
            getHomeWorksForClassByStudent(invitationCode, request.session.user, (error, result) => {
                if (error) {
                    response.end();
                    console.log("failed To Return Data")
                    return error;
                } else {
                    homeworks = JSON.parse(JSON.stringify(result));
                    console.log(homeworks)
                    response.render('student-homework', {homeworks:homeworks, className:className, invitationCode:invitationCode});
                }
            });
            
        } else {
            response.render('student-homework', {homeworks:homeworks, className:className, invitationCode:invitationCode});
        }
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.post('/api/student-joinclass', (request, response) => {
    console.log('Processing AddClass Request For Student...');
    console.log(request.body);
    if (request.session.user) {
        joinClassForStudent(request, request.session.user, (error, result) => {
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

app.post('/api/student-dropclass', (request, response) => {
    console.log('Processing deleteClass Request...');
    console.log(request.body);
    if (request.session.user) {
        dropClassForStudent(request, request.session.user, (error, result) => {
            if (error) {
                throw error;
            }
            return response.json({status:'ok'});
        });
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})

app.post('/api/student-submission', (request, response) => {
    console.log('Processing Student Submission...');
    console.log(request.body);
    if (request.session.user) {
        addHomeworkSubmission(request, request.session.user, (error, result) => {
            if (error) {
                throw error;
            }
            return response.json({status:'ok'});
        });
    } else {
        response.sendFile('403.html', {root: __dirname+'/views'});
    }
})
