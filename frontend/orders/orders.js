
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

showOrders()

async function showOrders() {
   try {
     const orders = await getOrders(username)
     console.log(orders)
     const container = document.querySelector(".order-cards-container");
     if(orders){
   
         orders.forEach(order => {
         const address =  order.payer_fullAddress
         const addressLine1 = address.address_line_1
         const admin1 = address.admin_area_1
         const admin2 = address.admin_area_2
         const countryCode = address.country_code
         const postalCode = address.postal_code
         const payerFullAddress = addressLine1 + admin1 + admin2 + " " + countryCode 
         const orderCard = document.createElement("div");
         orderCard.className = "order-card order-page";
         
         const title = document.createElement("h3");
         title.className = "transaction-form-title";
         title.textContent = "Transaction Data";
         orderCard.appendChild(title);
         
         const orderData = document.createElement("div");
         orderData.className = "order-data";
         
         
         const purchasedItemsDiv = document.createElement("div");
         purchasedItemsDiv.className = "order-section";
         order.purchased_products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.className = "product-item";
            
            const productName = capitalizeFirstLetters(product.product_name);
            const productText = document.createElement("span");
            productText.className = "data items";
            productText.textContent = `${productName} ($${product.product_price})`;
            
            productDiv.appendChild(productText);
            purchasedItemsDiv.appendChild(productDiv);
         });
         
         const orderSections = [
            { label: "Transaction Date:", id: "date", data: order.payment_date },
            { label: "Transaction ID:", id: "order-id", data: order.payment_id },
            { label: "Username:", id: "username", data: username },
            { label: "Email:", id: "email", data: email },
            { label: "Full Name:", id: "full-name", data: order.payer_fullName },
            { label: "Address:", id: "address", data: payerFullAddress },
            { label: "Purchased Items:", id: "purchased-items", data: null }, // Placeholder for purchased items
            { label: "Grand Total:", id: "grand-total", data: `$${order.grand_total}` },
            { label: "Order Status:", id: "order-status", data: order.order_status },
          ];
   
         orderSections.forEach(section => {
            const sectionDiv = document.createElement("div");
            sectionDiv.className = "order-section";
            
            const labelSpan = document.createElement("span");
            labelSpan.textContent = section.label;
            
            const dataSpan = document.createElement("span");
            dataSpan.className = "data";
            dataSpan.textContent = section.data;

            if (section.id === "purchased-items"){
               dataSpan.appendChild(purchasedItemsDiv)
               dataSpan.classList.add("items")
               sectionDiv.classList.add("items")
            }

            sectionDiv.appendChild(labelSpan);
            sectionDiv.appendChild(dataSpan);
            orderData.appendChild(sectionDiv);
         });
         orderCard.appendChild(orderData);
         container.appendChild(orderCard);
         });
       }

   } catch (e) {
     console.log(e);
   }
 }
 

async function getOrders(username) {
   try{
      const response = await fetch(API_LINK + "/orders/get-user-orders/"+username)
      if(response){
         const orders = await response.json()
         if(orders){
            return orders
         }
           
         else console.log("No orders")
      }
      else console.log("No response")
   }
   catch(e){
      console.log(e)
   }
}


function capitalizeFirstLetters(str){
   return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
