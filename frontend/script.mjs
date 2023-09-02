//fix ui
   //responsiveness (mobile view)
//add contact info
//add about page


const API_LINK = "http://localhost:8000/api/v1/hello-books"



const usernameEl = document.querySelector(".username")
const emailEl = document.querySelector(".email")
const logoutButton = document.querySelector(".logout-button")
logoutButton.addEventListener("click", ()=>{
   window.location.href = "login.html"
})

const loggedIn = sessionStorage.getItem("loggedIn")

if(!loggedIn){
   usernameEl.textContent = "Login to your account now"
   emailEl.textContent =  null
   logoutButton.textContent = "Login"
}

else {
   const username = sessionStorage.getItem("username")
   const email = sessionStorage.getItem("email")
   usernameEl.textContent = "Username:" + username
   emailEl.textContent =  email
}



async function initilizePage() {
   try {
       const products = await getCartProducts()
       showProducts(products)
   } catch (error) {
       console.error("An error occurred:", error)
   }
}

initilizePage()

function showProducts(products){
   const productContainer = document.querySelector(".product-container")
   products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      
      const priceTag = document.createElement("div");
      priceTag.className = "price-tag"
      priceTag.textContent = "$" + product.product_price;
      productCard.appendChild(priceTag)
      
      const productImage = document.createElement("img");
      productImage.src = product.product_img_src;
      productImage.className = "product-image"
      productCard.appendChild(productImage);

      const productName = document.createElement("div");
      productName.className = "product-name";
      productName.textContent = product.product_name;
      productCard.appendChild(productName);

      const quantityInput = document.createElement("input");
      quantityInput.type = "text";
      quantityInput.placeholder = "Quantity";
      quantityInput.value = 1
      quantityInput.className = "product-quantity-input";
      productCard.appendChild(quantityInput);

      const addToCartButton = document.createElement("button");
      addToCartButton.textContent = "Add To Cart";
      addToCartButton.className = "add-to-cart-button";
      //handle adding product to cart
      addToCartButton.addEventListener("click", ()=>{
         addProductToCart(product, username, quantityInput.value)
      })
   
      productCard.appendChild(addToCartButton)
      productContainer.appendChild(productCard)
   })
}


 async function getCartProducts(){
   try{
       const response = await fetch(API_LINK+"/products/get-products")
       if(response){
           const data = await response.json()
           return data
       }
       else 
           console.log("Couldnt get products")
   }
   catch(e){
       console.log(e)
   }
}


async function addProductToCart(product, username, quantity){
   const productId = product._id

   if(await productAlreadyInCart(productId, username)){
      showNotification("Product is already in cart", 2000);
       return
   }
   else {
      try{
         const response = await fetch(API_LINK+"/cart/add-product/"+productId, {
            method: 'POST',
            headers: {
               "Content-type":"application/JSON"
            },
            body: JSON.stringify({
               username: username,
               quantity: quantity
            })
         })
         if(response)
             showNotification("Product has been added to cart", 2000);
      }
      catch(e){
         console.log(e)
      }
   }
 
}


async function productAlreadyInCart(productId, username){
   try{
      const response = await fetch(API_LINK+"/cart/get-product/"+productId+"/"+username) 
      if(response){
         const product = await response.json()
         if(product)
            return true
         else return false
      }                                                             
   }
   catch(e){
      console.log(e)
   }
}


function showNotification(message, duration) {
   const notificationBar = document.querySelector('.notif-bar');
   const header = document.querySelector(".header")
   notificationBar.textContent = message;
   notificationBar.style.display = 'block';
   header.style.marginTop = "40px" 
   setTimeout(function() {
       notificationBar.style.display = 'none';
       header.style.marginTop = "0"
   }, duration);
}

const toggleButton = document.getElementById('navbar-toggle');
const navMenu = document.getElementById('navbar-menu');


toggleButton.addEventListener('click', function () {
   console.log("toggle")
   navMenu.classList.toggle('active');
});

function preventBack(){
   window.history.forward()
}

setTimeout("preventBack()", 0)
window.onunload=function(){null}