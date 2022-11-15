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

const userLogin = document.getElementById("userLogin");

async function login() {
    var loginEmailId = document.getElementById("loginEmailId").value;
    var loginPassword = document.getElementById("loginPassword").value;
    console.log("Login Email :: "+loginEmailId);
    console.log("Login Password :: "+loginPassword);
    
    fetch('/api/login', {
        headers: {
            'Content-type': 'application/json'
        }, 
        method: "POST",
        body: JSON.stringify({loginEmailId, loginPassword})
    })
    
}

const registrationForm = document.getElementById('register');
registrationForm.addEventListener('submit', register);

async function register(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const emailId = document.getElementById("emailId").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userType = document.getElementById("userType").value;

    if (userType == "" || userType == undefined){
        alert("User Category Can not be Blank")
        return;
    } else if (password != confirmPassword) {
        alert("Password Does Not Match!!!!");
        return;
    } else {
        const result = await fetch('/api/register', {
            headers: {
                'Content-type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({firstName, lastName,emailId, phoneNumber,password,userType})
        })
        .then(res => res.json())

        console.log(result);
        if (result.status == "ok") {
            alert("User Registered Succesfully, Please Login!!!")
        } else {
            alert(result.error);
        }
    }
}