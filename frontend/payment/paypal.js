//secure grandTotal (it is simply encoded)

import OrderService from "../services/order.service.mjs";

const API_LINK = "http://localhost:8000/api/v1/hello-books"

const currentUrl = window.location.href 
const url = new URL(currentUrl);
const grandTotalEncoded = url.searchParams.get('grandTotal');
const grandTotal = parseInt(atob(grandTotalEncoded))
const productsStringEncoded = url.searchParams.get('products');
const productsStringDecoded = decodeURIComponent(productsStringEncoded)
const products = JSON.parse(productsStringDecoded)


const username = sessionStorage.getItem("username")
const email = sessionStorage.getItem("email")


//setup date display
const date = new Date()
const dateString = date.toString()
const formattedDate = dateString.replace(" (Coordinated Universal Time)", "")


paypal.Buttons({
    // Order is created on the server and the order id is returned
    createOrder() {
      return fetch(API_LINK + "/payment/paypal/create-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the   "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: [
            {
              sku: 10,
              quantity: 2,
            },
          ],
          total: grandTotal
        }),
      })
      .then((response) => response.json())
      .then((order) => order.id);
    },
    // Finalize the transaction on the server after payer approval
    onApprove(data) {
      return fetch(API_LINK + "/payment/paypal/capture-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID
        })
      })
      .then((response) => {
        return response.json()
      })
      .then(async (orderData) => {       
       const orderDataString = JSON.stringify(orderData)
        if(orderData.status === "COMPLETED")
            await OrderService.createOrder(formattedDate, orderData, username, email, products, grandTotal)
        console.log("hello")
        window.location.href = `payment_status.html?orderData=${encodeURIComponent(orderDataString)}&grandTotal=${grandTotalEncoded}&products=${productsStringEncoded}`
      });
    }
  }).render('#paypal');