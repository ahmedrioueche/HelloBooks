import DashboardService from "../services/dashboard.service.mjs"

const API_LINK = "http://localhost:8000/api/v1/hello-books"

const username = sessionStorage.getItem("username")
const email = sessionStorage.getItem("email")
const usernameEl = document.querySelector(".username")
usernameEl.textContent = "Username: " + username
const emailEl = document.querySelector(".email")
emailEl.textContent =  email

const logoutButton = document.querySelector(".logout-button")
logoutButton.addEventListener("click", ()=>{
   window.location.href = "../login.html"
})

const usersCards = document.querySelector(".users-cards")

showUsers()


async function showUsers(){
    const data = await getUsers()
    data.forEach(user => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card")
        userCard.innerHTML += `
                                <div class="user-card-username">Username: <span class="username">${user.username}</span></div>
                                <div class="user-card-email">Email: <span class="email">${user.email}</span></div>   
                                <div class="user-card-type">Account type: <span class="user-type">${user.type}</span></div>
                                    `

    const deleteUserButton = document.createElement("button")
    deleteUserButton.textContent = "Delete User"
    deleteUserButton.classList.add("delete-user-button")
    userCard.appendChild(deleteUserButton)
    
    deleteUserButton.addEventListener("click", async() => {
        console.log("delete user:", user.username)
        await deleteUser(user.username)
        window.location.reload()
    })

    usersCards.appendChild(userCard);
    })  
}

async function getUsers(){
    try{
        const response = await fetch(API_LINK+"/users/get-Users")
        if(response.ok){
            const data = await response.json()
            console.log(data)
            return data
        }
        else  console.log("couldn't get data")
    }
    catch(e){
        console.log("error:", e)
    }
    
}


async function deleteUser(username){
    try{
        const response = await fetch(API_LINK+"/users/delete-user/"+username, {
            method: 'DELETE'
        })
        if(response.ok){    
            console.log("User", username, "was deleted successfully")
            await DashboardService.updateUserCount(false) //true for adding, false for deleting
        }
          
        else        
            console.log("Unable to delete user", username)
    }
    catch(e){
        console.log("error:", e)
    }
}