const API_LINK = "http://localhost:8000/api/v1/hello-books"

export default class CartService{

    static async clearCart(username){
        const productsData = await CartService.getCartProductData(username)
        for(const productData of productsData){
            await CartService.removeProductFromCart(productData.product_id, username)
        }
    }

    //get product ids from cart
    static async getCartProductData(username){ 
        try{   
            const response = await fetch(API_LINK+"/cart/get-products/"+username)
            if(response){
                const productsData = await response.json()
                return productsData
            }
            else console.log("No response")
        }
        catch(e){
            console.log(e)
        }
    }

    //use the product ids to fetch for the corresponding products
    static async getCartProducts(username) { 
        const productsData =  await CartService.getCartProductData(username)
        let productArray = []
        for (const productData of productsData) {
            try{
                const response = await fetch(API_LINK+"/products/get-product/"+productData.product_id)
                if(response){
                    const product = await response.json()
                    if(product){
                        product.quantity = productData.quantity
                        productArray.push(product)
                    }                
                }
                else {
                    console.log("Couldnt get product")
                }            
            }   
            catch(e){
                console.log(e)
            }
        }
        return productArray
    }

    
    
    static async removeProductFromCart(productId, username) {
        try{
            const response = await fetch(API_LINK+"/cart/delete-product/"+productId+"/"+username, {
                method: 'DELETE'
            })
            if(response.ok){
                console.log("product deleted")
            }
        }
        catch(e){
            console.log(e)
        }
    }


    //update product
    static async updateProductData(product, productCard, quantityEl){
        const quantityInput = document.createElement("input");
            quantityInput.type = "text";
            quantityInput.placeholder = "Quantity";
            quantityInput.className = "product-quantity-input";
            productCard.append(quantityInput);

        quantityEl.remove()

}





}
