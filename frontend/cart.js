//add sripe and cib
//disable buttons when cart empty 
//improve ui
import CartService from "./services/cart.service.mjs"
const API_LINK = "http://localhost:8000/api/v1/hello-books"

const username = sessionStorage.getItem("username")
const email = sessionStorage.getItem("email")

const usernameEl = document.querySelector(".username")
usernameEl.textContent = "Username: " + username

const emailEl = document.querySelector(".email")
emailEl.textContent =  email

const logoutButton = document.querySelector(".logout-button")
logoutButton.addEventListener("click", ()=>{
   window.location.href = "login.html"
})


initializePage()
showCartProducts(username)

function initializePage(){

    const clearCartButton = document.querySelector(".delete-button.cart")
    clearCartButton.classList.remove("hide")
    clearCartButton.disabled = false

    const checkoutButton = document.querySelector(".checkout-button")
    checkoutButton.classList.remove("hide")
    checkoutButton.disabled = false
}


let grandTotal = 0 //sum of products' sub_total

async function showCartProducts(username) { //get products and display them 
    const products = await CartService.getCartProducts(username)
    const productContainer = document.querySelector(".product-container")
  
    if(products.length !== 0){
        products.forEach(product => {
            let subTotal //product_price * product_quantity
    
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
        
            const quantityEl = document.createElement("h4");
            quantityEl.className = "product-quantity";
            quantityEl.textContent = "Quantity: " + product.quantity
            productCard.appendChild(quantityEl);
     
            subTotal = product.product_price * product.quantity
            grandTotal += subTotal
            product.subTotal = subTotal
            const grandTotalEl = document.querySelector(".total-price")
            grandTotalEl.textContent = "$" + grandTotal
    
            const buttons = document.createElement("div")
            buttons.className = "buttons"
            

            //update products
            const updateButton = document.createElement("button");
            updateButton.className = "update-button";
            updateButton.textContent = "Update";
            updateButton.addEventListener("click", () => {
               //CartService.updateProductData(product, productCard, quantityEl)       #TODO
            }); 
            buttons.appendChild(updateButton);

            //delete product from cart
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", async () => {
               await CartService.removeProductFromCart(product._id, username) 
                .then(()=>{
                    window.location.reload()
                })
            });
    
           buttons.appendChild(deleteButton);
           productCard.appendChild(buttons);
           productContainer.appendChild(productCard);
        })
    }
    else {
        const cartEmpty = document.createElement("h4");
        cartEmpty.className = "cart-empty";
        cartEmpty.textContent = "Your cart is empty"
        productContainer.appendChild(cartEmpty)

        const clearCartButton = document.querySelector(".delete-button.cart")
        clearCartButton.classList.add("hide")
        clearCartButton.disabled = true
        const checkoutButton = document.querySelector(".checkout-button")
        checkoutButton.classList.add("hide")
        checkoutButton.disabled = true
    }   

    document.querySelector(".checkout-button").addEventListener("click", async ()=>{
        showCheckOutForm(products, grandTotal)
   })
   document.querySelector(".continue-shopping-button").addEventListener("click", async ()=>{
        window.location.href = "index.html"
    })
}


//clear Cart
document.querySelector(".delete-button.cart").addEventListener("click", async ()=>{
    await CartService.clearCart(username)
     window.location.reload()
})


//Checkout
async function showCheckOutForm(products, totalPrice){
    console.log("products:", products)
    const checkoutFormBG = document.querySelector(".checkout-form-bg")
    checkoutFormBG.classList.add("show")

    const cancelButton = document.querySelector(".cancel-button")
    cancelButton.addEventListener("click", ()=> {
        checkoutFormBG.classList.remove("show")
    })
    products.forEach(product => {
    
        const purchasedProductsContainer = document.querySelector('.Purchased-products');
        const ulElement = document.createElement('ul');
        const liElement = document.createElement('li');
        const productNameElement = document.createElement('span');
        const priceText = document.createTextNode('Price: ');
        const productPriceElement = document.createElement('span');
        const quantityText = document.createTextNode(', Quantity: ');
        const quantityElement = document.createElement('span');
        const totalText = document.createTextNode(', Total: ');
        const subTotalElement = document.createElement('span');
        const grandTotal = document.getElementById("totalPrice")
        const br = document.createElement("br")

        ulElement.className = 'product-list';
        productNameElement.className = 'product-name';
        productNameElement.id = 'productName';
        productPriceElement.className = 'product-price-checkout';
        productPriceElement.id = 'productPrice';
        quantityElement.className = 'quantity';
        quantityElement.id = 'quantity';
        subTotalElement.className = 'sub-total';
        subTotalElement.id = 'subTotal';

        productNameElement.textContent = product.product_name
        productPriceElement.textContent = "$"+product.product_price
        quantityElement.textContent = product.quantity
        subTotalElement.textContent =  "$"+product.subTotal
        grandTotal.textContent = "$"+totalPrice

        liElement.appendChild(productNameElement);
        liElement.appendChild(br);
        liElement.appendChild(document.createTextNode(' ('));
        liElement.appendChild(priceText);
        liElement.appendChild(productPriceElement);
        liElement.appendChild(quantityText);
        liElement.appendChild(quantityElement);
        liElement.appendChild(totalText);
        liElement.appendChild(subTotalElement);
        liElement.appendChild(document.createTextNode(')'));
        ulElement.appendChild(liElement);
        purchasedProductsContainer.appendChild(ulElement);
    })

    const confirmButton = document.querySelector(".confirm-button")
    
    //open payement window  
    confirmButton.addEventListener("click", async ()=>{
        //remove product image source
        const keyToRemove = "product_img_src";
        const productsNoImageSrc = products.map(product =>{
            const {[keyToRemove]: value, ...rest} = product
            return rest
        })

        //encode products
        const productsString = JSON.stringify(productsNoImageSrc)
        const productsStringEncoded = encodeURIComponent(productsString)


        //encode total price
        const grandTotalEncoded = btoa(grandTotal.toString())
        console.log("grandTotalEncoded:", grandTotalEncoded)

        const methodSelect = document.querySelector(".payment-method-select")
        switch(methodSelect.value){
               //paypal payment window 
            case "Paypal":  window.location.href = `payment/paypal.html?grandTotal=${grandTotalEncoded}&products=${productsStringEncoded}`
            break
            case "Stripe":  window.location.href = `index.html`  //add stipe
            break
            case "SIB":  window.location.href = `index.html`  //add sib
            break
            //add other payment methods
        }
    })  
}
