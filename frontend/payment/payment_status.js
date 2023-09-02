//prevent storing duplicate orders
import DashboardService from "../services/dashboard.service.mjs"
import CartService from "../services/cart.service.mjs"
import OrderService from "../services/order.service.mjs"
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

const currentUrl = window.location.href 
const url = new URL(currentUrl)
const orderDataString = url.searchParams.get('orderData')
const decodedOrderDataString = decodeURIComponent(orderDataString)
const orderData = JSON.parse(decodedOrderDataString)

const productsStringEncoded = url.searchParams.get('products');
const productsStringDecoded = decodeURIComponent(productsStringEncoded)
const products = JSON.parse(productsStringDecoded)

const grandTotalEncoded = url.searchParams.get('grandTotal');
const grandTotal = parseInt(atob(grandTotalEncoded))

const statusMessage = document.querySelector(".status-message")

//setup date display
const date = new Date()
const dateString = date.toString()
const formattedDate = dateString.replace(" (Coordinated Universal Time)", "")
console.log("formattedDate", formattedDate)

await handlePayment()

async function handlePayment(){

    if(paymentCompleted(orderData)) {
        showOrderData(formattedDate, orderData, username, email, products, grandTotal)
      //  await createOrder(formattedDate, orderData, username, email, products, grandTotal)
        await CartService.clearCart(username)
     }
    
    else {
        statusMessage.textContent = "Payment Failed"
    }
}


function paymentCompleted(orderData){
    return orderData.status === "COMPLETED"
}





function showOrderData(date, orderData, username, email, products, total){
    
     //setup address display
    const address =  orderData.purchase_units[0].shipping.address
    const addressLine1 = address.address_line_1
    const admin1 = address.admin_area_1
    const admin2 = address.admin_area_2
    const countryCode = address.country_code
    const postalCode = address.postal_code

    statusMessage.textContent = "Payment was successful"

    const OrderDate = document.getElementById("date")
    OrderDate.textContent = date

    const orderId = document.getElementById("order-id")
    orderId.textContent = orderData.id

    
    const usernameEl = document.getElementById("username")
    usernameEl.textContent = username

    const emailEl = document.getElementById("email")
    emailEl.textContent = email

    
    const fullName = document.getElementById("full-name")
    fullName.textContent = orderData.purchase_units[0].shipping.name.full_name
    
    const addressEl = document.getElementById("address")
    addressEl.textContent = addressLine1 + admin1 + " " +admin2 + " " + countryCode 
    
    const purchasedProducts = document.getElementById("purchased-items")
    products.forEach(product => {
        const productDiv = document.createElement("div")
        productDiv.className = "product-item"
    
        const productName = product.product_name;
        const capitalizedProductName = productName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

        const productText = document.createElement("span")
        productText.classList.add("data")
        productText.classList.add("items")
        productText.textContent = capitalizedProductName + ` ($${product.product_price})`

        productDiv.appendChild(productText)
        purchasedProducts.appendChild(productDiv)
    });

    
    const grandTotalEl = document.getElementById("grand-total")
    grandTotalEl.textContent = "$"+total

    
    const orderStatus = document.getElementById("order-status")
    orderStatus.textContent = "Pending"
}    

