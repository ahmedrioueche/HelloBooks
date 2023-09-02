//fix updating product image in showUpdateProductForm
//refactor and organize this file
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

const addProductButton = document.querySelector(".add-product-button")
addProductButton.addEventListener("click", ()=>{
    console.log("add product")
   toggleProductForm()
})

async function toggleProductForm(){
    const addProductsForm = document.querySelector(".add-product-form")
    addProductsForm.classList.toggle("show")
}

initializePage() //show products

const productContainer = document.querySelector(".products-container")
const productNameEl = document.querySelector(".product-name-input-box")
const productPriceEl = document.querySelector(".product-price-input-box")
const productQuantityEl = document.querySelector(".product-copies-input-box")
const addToShopButton = document.querySelector(".add-to-shop-button")
const inputFileEl = document.querySelector(".product-file-input-box")
const productImg = document.createElement("img")


getImageSrcFile(inputFileEl, productImg) 
  

addToShopButton.addEventListener("click", async ()=>{

    const productName = productNameEl.value
    const productPrice = productPriceEl.value
    const productQuantity = productQuantityEl.value

    if(!productName || !productPrice || !productQuantity || !productImg)
        console.log("You idiot")
    else {
        await storeProduct(productName, productPrice, productQuantity, productImg)
        window.location.reload()
    }
        
})  

async function initializePage() {
    try {
        const products = await getProducts();
        console.log(products)
        showProducts(products); 
    } catch (e) {
        console.log(e);
    }
   
}


function getImageSrcFile(inputFile, img){

    let fileName 
    inputFile.addEventListener("change", function() { //get image source file
        const selectedImg = inputFile.files[0];
        if (selectedImg) {
            console.log("selectedImg")
            const reader = new FileReader();
            fileName = selectedImg.name;
            reader.onload = function(e) {
                img.src = e.target.result; // Set the source of the preview image
            };
            reader.readAsDataURL(selectedImg); // Read the selected file as a data URL
    }
    })
    console.log("img src", img.src)
    return {img_src: img.src, img_name: fileName}
}


function showProducts(products){
    products.forEach(product => {
        const productCard = document.createElement("div")
        productCard.className = "product-card"

        const productImage = document.createElement("img");
        productImage.src = product.product_img_src;
        productImage.className = "product-image"
        productCard.appendChild(productImage);

        const productName = document.createElement("div");
        productName.className = "product-name";
        productName.textContent = product.product_name;
        productCard.appendChild(productName);

        const productPrice = document.createElement("div");
        productPrice.className = "product-price";
        productPrice.textContent = `$${product.product_price}`;
        productCard.appendChild(productPrice);

        const productQuantity = document.createElement("div");
        productQuantity.className = "product-quantity";
        productQuantity.textContent = `Quantity: ${product.product_copies}`;
        productCard.appendChild(productQuantity);

        const buttons = document.createElement("div")
        buttons.className = "buttons"
        
        const updateButton = document.createElement("button");
        updateButton.className = "update-button";
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
            showUpdateProductForm(product)
        });
        buttons.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
           await deleteProduct(product._id) 
           await OrderService.updateProductCount(false) //true for adding, false for deleting
            .then(()=>{ 
                window.location.reload()
            })
        });
        buttons.appendChild(deleteButton);
        productCard.appendChild(buttons);
        productContainer.appendChild(productCard);
    });
}


async function storeProduct(productName, productPrice, productCopies, productImg){
    try{
        const response = await fetch(API_LINK+"/products/new-product", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                product_name: productName,
                product_price: productPrice,
                product_copies: productCopies,
                product_img_src: productImg.src
            })
        })
        if(response.ok){
            console.log("Product was stored successfully")
            //update product count
            await OrderService.updateProductCount(true) //true for adding, false for deleting
        }
          
    }
    catch(e){
        console.log(e)
    }
}


async function getProducts(){
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

async function deleteProduct(productId){
    try{
        const response = await fetch(API_LINK+"/products/delete-product/"+productId, {
            method: "DELETE"
        })
        if(response)
            console.log(response)    
    }
    catch(e){
        console.log(e)
    }
}

function showUpdateProductForm(product){
    const updateProductDiv = document.querySelector(".update-product-div")
    updateProductDiv.classList.add("show")

    const updateProductForm = document.querySelector(".update-product-form")
    const productNameEl = updateProductForm.querySelector(".product-name-input-box")
    const productPriceEl = updateProductForm.querySelector(".product-price-input-box")
    const productQuantityEl = updateProductForm.querySelector(".product-copies-input-box")
    const fileEl = document.querySelector(".product-file-input-box")
    const productImg = document.createElement("img")

    productNameEl.value = product.product_name
    productPriceEl.value = product.product_price
    productQuantityEl.value = product.product_copies
    productImg.src = product.product_img_src
    updateProductForm.querySelector(".update-product-button").addEventListener("click", async () => {
        const productName = productNameEl.value;
        const productPrice = productPriceEl.value;
        const productQuantity = productQuantityEl.value;

        updateProductDiv.addEventListener("change", function() {
            const selectedImg = fileEl.files[0];
            if (selectedImg) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    productImg.src = e.target.result; // Set the source of the preview image
                };
                reader.readAsDataURL(selectedImg); // Read the selected file as a data URL
            }
        });

        console.log("productImg src:", productImg.src)
        await updateProduct(product._id, productName, productPrice, productQuantity, productImg)
        window.location.reload()
    });

    updateProductForm.querySelector(".cancel-button").addEventListener("click",  () => {
        updateProductDiv.classList.remove("show")
    })
}


async function updateProduct(productId, productName, productPrice, productQuantity, productImg){
    try{
        const response = await fetch(API_LINK+"/products/update-product/"+productId, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                product_name: productName,
                product_price: productPrice,
                product_copies: productQuantity,
                product_img_src: productImg.src
            })
        })
        if(response.ok)
            console.log("Product was updated successfully")
    }
    catch(e){
        console.log(e)
    }
}