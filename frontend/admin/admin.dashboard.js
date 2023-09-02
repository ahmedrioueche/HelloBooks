//retrieve and show actual data on dashboard

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

const dashboardCards = document.querySelector(".dashboard-cards")

const data = showDashBoard()

async function showDashBoard(){
    const data = await DashboardService.getDashboardData()
   
    Object.entries(data[0]).forEach(([key, value]) => {
        if(key !== "_id"){ 
            const dashboardCard = document.createElement("div")
            dashboardCard.classList.add("dashboard-card")
            const dashboardCardDataDiv = document.createElement("div")
            dashboardCardDataDiv.classList.add("dashboard-info-data")
            const dashboardCardData = document.createElement("span")
            dashboardCardData.setAttribute("id", `${value}`)
            dashboardCardData.textContent = value
            const dashboardCardKey = document.createElement("div")
            dashboardCardKey.classList.add("dashboard-info-name")
            dashboardCardKey.textContent = key
           
            if(key === "payments")
                dashboardCardData.textContent = "$" + value
 
            if(key === "total_accounts") 
                key = "Total accounts"
            

            dashboardCards.appendChild(dashboardCard)
            dashboardCard.appendChild(dashboardCardDataDiv)
            dashboardCardDataDiv.appendChild(dashboardCardData)
            dashboardCard.appendChild(dashboardCardKey)
        }
    })

   return data
}









function preventBack(){
    window.history.forward()
 }
 
 setTimeout("preventBack()", 0)
 window.onunload=function(){null}