//improve error display
const API_LINK = "http://localhost:8000/api/v1/hello-books"

const usernameEl = document.querySelector(".username-input-box")
const userPasswordEl = document.querySelector(".password-input-box")
const loginButton = document.querySelector(".login-button")
clearForm()
loginButton.addEventListener("click", async ()=>{
    clearForm()
   
    let userExists
    const username = usernameEl.value
    const userPassword = userPasswordEl.value
    const userData = await getUserInfo(username) //get user data from db
    const userId = userData._id
    const userEmail = userData.email
    const accountType = userData.type //differentiate user from admin

    const hashedPassword = userData.password

    if(userData){
        userExists = true
        console.log("userData:", userData)
        if(userPassword){
            if(await checkPassword(userPassword, hashedPassword)){
                if(accountType === "user")
                window.location.href = `index.html?userId=${userId}&username=${username}&email=${userEmail}`
                else if(accountType === "admin") 
                    window.location.href = `admin/admin.dashboard.html?userId=${userId}&username=${username}&email=${userEmail}`
                else console.error("could not determine account type")
            }
            else userDataIssue(userExists)
        }
       
    }  
    else {
        userExists = false
        userDataIssue(userExists)
    }
    sessionStorage.setItem("loggedIn", true)
    sessionStorage.setItem("username", username)
    sessionStorage.setItem("email", userEmail)
})


async function getUserInfo(username){
   try{
        const response =  await fetch(API_LINK+"/users/get-user/"+username)
        if(response.ok){
            const userData = await response.json()
            return userData
        }
        else { 
            return false
        }
   }
   catch(e){
        console.error("Error:", e)
   }

}


async function checkPassword(userPassword, hashedPassword){
    try{
        const response =  await fetch(API_LINK + "/users/verify-password/"+userPassword+"/"+encodeURIComponent(hashedPassword))
        if(response){
            const data = await response.json()
            return data
        }
        else {
            console.log("Error: couldn't verify password")
            return false
        }
           
    }
    catch(e){
        console.log(e)
    }
}



function userDataIssue(userExists){
    let error
    if(userExists){
        error = "Incorrect password"
        const passwordErrorTextEl = document.getElementById("password-error")
        passwordErrorTextEl.textContent = error
        userPasswordEl.classList.add("red-border")
        passwordErrorTextEl.style.display = "block"
    }
    else {
        error = "Username doesn't exist"
        const usernameErrorTextEl = document.getElementById("username-error")
        usernameErrorTextEl.textContent = error
        usernameEl.classList.add("red-border")
        usernameErrorTextEl.style.display = "block"
    }
}

function clearForm(){

    usernameEl.classList.remove("red-border") 
    userPasswordEl.classList.remove("red-border")

    const passwordErrorTextEl = document.getElementById("password-error")
    const usernameErrorTextEl = document.getElementById("username-error")

    passwordErrorTextEl.style.display = "none"
    usernameErrorTextEl.style.display = "none"

}




function preventBack(){
    window.history.forward()
}

setTimeout("preventBack()", 0)
window.onunload=function(){null}
