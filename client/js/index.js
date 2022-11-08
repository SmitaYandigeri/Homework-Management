const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (()=>{
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%"; 
});
signupLink.onclick = (()=>{
  signupBtn.click();
  return false;
});

function login() {
    var loginEmailId = document.getElementById("loginEmailId").value;
    var loginPassword = document.getElementById("loginPassword").value;
    console.log("Login Email :: "+loginEmailId);
    console.log("Login Password :: "+loginPassword);
    
    if (loginEmailId == "" || loginPassword == "" ) {
        alert("Can't Login With Empty Email/Password")
    } else {
        fetch('http://localhost:5000/login')
            .then(response => response.json())
            .then(data => console.log(data));
        alert("UNDER DEVELOPMENET !!!");
    }
}

function register() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var emailId = document.getElementById("emailId").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var userType = document.getElementById("userType").value;

    if (password != confirmPassword) {
        alert("Password Does Not Match!!!!");
        return;
    } else if (userType == "" || userType == undefined){
        alert("User Category Can not be Blank")
    }
    else {
        fetch('http://localhost:5000/register', {
            headers: {
                'Content-type': 'application/json'
            }, 
            method: "POST",
            body: JSON.stringify({"firstName": firstName, "lastName":lastName, "emailId":emailId, "phoneNumber":phoneNumber, 
            "password":password, "userType": userType})
        })
            .then(response => response.json())
            .then(data => alert("Registration SuccessFul !!!! Future pages under developmenyt."));
    
    }   
}