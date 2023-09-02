//add user counter to store in admin dashboard

import DashboardService from "./services/dashboard.service.mjs"

const API_LINK = "http://localhost:8000/api/v1/hello-books"

const usernameEl = document.querySelector(".username-input-box")
const userEmailEl = document.querySelector(".email-input-box")
const userPasswordEl = document.querySelector(".password-input-box")
const userConfirmPasswordEl = document.querySelector(".password-confirmation-input-box")
const accountType = "user" //set all registered users' account type to user 
const registerButton = document.querySelector(".register-button")


//clear the form when the page loads
document.addEventListener("DOMContentLoaded", function() {
    clearForm(usernameEl, userEmailEl, userPasswordEl, userConfirmPasswordEl);
});



registerButton.addEventListener("click", async ()=>{
    //clear the form when register button is pressed
    clearForm(usernameEl, userEmailEl, userPasswordEl, userConfirmPasswordEl);

    const userData = {
         username: usernameEl.value,
         email: userEmailEl.value,
         password: userPasswordEl.value,
         confirmPassword: userConfirmPasswordEl.value
    }

    const errorsData = {username:{}, email:{}, password:{}, confirmPassword:{}}
    if(await handleErrors(userData, errorsData)) //returns true if no errors
        await createAccount(userData, accountType)
   
   
})


async function createAccount(userData, accountType){
   try{
        const response = await fetch(API_LINK+"/newuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                type: accountType
            })
        })
        const data = await response.json()
        if(data.error){ //if there is an error 
            console.log("error", data.error)
        }
        else {
            console.log("User was created successfully")
            //update user count
            await DashboardService.updateUserCount(true)  //true for adding, false for deleting
            window.location.href = "login.html"
            
        }
   }
   catch(e){
    console.error("Error:", e)
   }
}



async function handleErrors(userData, errorsData){
   
    //check if form is empty
    isFormEmpty(userData, errorsData)
    //check if data is unique
    await isDataUnique(userData, errorsData)
    //check if passwords match
    checkPasswords(userData, errorsData)
    //show errors on form
    showErrors(errorsData)

    if (isErrorsDataEmpty(errorsData)) //check for errors
       return true
     else 
        return false
    
}


function isFormEmpty(userData, errorsData){

    if(!userData.username)
        errorsData.username.emptyError = "Please enter a username"
    
    if(!userData.email)
        errorsData.email.emptyError = "Please enter an email"

    if(!userData.password)
        errorsData.password.emptyError = "Please enter a password"

    if(!userData.confirmPassword)
        errorsData.confirmPassword.emptyError = "Please confirm your password"

}


async function isDataUnique(userData, errorsData){

    if(await  usernameExists(userData.username))
        errorsData.username.notUniqueError = "Username is already taken"

    if(await  emailExists(userData.email))
          errorsData.email.notUniqueError = "Email is already registerd"

}


function checkPasswords(userData, errorsData){

    if(userData.password)
        if(userData.password.length < 6)
            errorsData.password.tooShortError = "Password should be at least 6 characters"
        
    if(userData.password !== userData.confirmPassword)
        errorsData.confirmPassword.noMatchError = "Passwords do not match"

}


function showErrors(errorsData){

    let error
    const usernameErrorTextEl = document.getElementById("username-error")
    const emailErrorTextEl = document.getElementById("email-error")
    const passwordErrorTextEl = document.getElementById("password-error")
    const passwordConErrorTextEl = document.getElementById("password-confirmation-error")

    if(errorsData.username.emptyError){
        usernameErrorTextEl.textContent = errorsData.username.emptyError
        usernameEl.classList.add("red-border")     
        usernameErrorTextEl.style.display = "block";   
    }
    else if(errorsData.username.notUniqueError){
        usernameErrorTextEl.textContent = errorsData.username.notUniqueError
        usernameEl.classList.add("red-border")    
        usernameErrorTextEl.style.display = "block";
    }
    if(errorsData.email.emptyError){
        emailErrorTextEl.textContent = errorsData.email.emptyError
        userEmailEl.classList.add("red-border")   
        emailErrorTextEl.style.display = "block";
             
    }
    else if(errorsData.email.notUniqueError){
        emailErrorTextEl.textContent = errorsData.email.notUniqueError
        userEmailEl.classList.add("red-border")    
        emailErrorTextEl.style.display = "block";
    }
    if(errorsData.password.emptyError){
        passwordErrorTextEl.textContent = errorsData.password.emptyError
        userPasswordEl.classList.add("red-border")       
        passwordErrorTextEl.style.display = "block"; 
    }
    else if(errorsData.password.tooShortError){
        passwordErrorTextEl.textContent = errorsData.password.tooShortError
        userPasswordEl.classList.add("red-border")    
        passwordErrorTextEl.style.display = "block";
    }

    if(errorsData.confirmPassword.emptyError){
        passwordConErrorTextEl.textContent = errorsData.confirmPassword.emptyError
        userConfirmPasswordEl.classList.add("red-border")       
        passwordConErrorTextEl.style.display = "block"; 
    }
    else if(errorsData.confirmPassword.noMatchError){
        passwordConErrorTextEl.textContent = errorsData.confirmPassword.noMatchError
        userConfirmPasswordEl.classList.add("red-border") 
        passwordConErrorTextEl.style.display = "block";   
    }

}



async function usernameExists(username){
    try {
        const response = await fetch(API_LINK+"/users/get-user/"+username)
        if(response.ok){
            return true
        }
        else return false
    }
    catch(e){
        console.error("Error:", e)
        return false;
    }
}


async function emailExists(email){
    try {
        const response = await fetch(API_LINK+"/users/get-user-email/"+email)
        if(response.ok){
            return true
        }
        else return false
    }
    catch(e){
        console.error("Error:", e)
        return false;
    }
}


function clearForm(usernameEl, userEmailEl, userPasswordEl, userConfirmPasswordEl) {
      [ usernameEl,
        userEmailEl,
        userPasswordEl,
        userConfirmPasswordEl
      ].forEach(element => element.classList.remove("red-border"));
      
    ["username-error", "email-error", "password-error", "password-confirmation-error"].forEach(id => {
        document.getElementById(id).style.display = "none";
      });

}

function isErrorsDataEmpty(obj) {
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object') {
                if (!isErrorsDataEmpty(obj[key])) {
                    return false; // Nested object has non-empty property
                }
            } else if (obj[key]) {
                return false; // Property is non-empty
            }
        }
    }
    return true; // All properties and nested properties are empty
    
}



function preventBack(){
    window.history.forward()
}

setTimeout("preventBack()", 0)
window.onunload=function(){null}