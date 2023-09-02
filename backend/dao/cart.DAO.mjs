import mongodb from "mongodb"

let cart
export default class CartDao {

    static async injectDB(client){
        if(cart)
            return
        try {
            
            cart = await client.db("products").collection("cart")
           
        }
        catch(e){
            console.error("Unable to establish connection with db: ", e)
        }
    }   



    static async addProductToCart(username, productId, quantity){
        try{
            const cartInfo = {
                username : username,
                product_id : productId,
                quantity: quantity
            }
            return await cart.insertOne(cartInfo)
        }
        catch(e){
            console.log(e)
        }
    }


    static async getAllCartProducts(){
        try{
            return await cart.find({}).toArray()
        } 
        catch(e){
            console.log(e)
        }
    }



    static async getCartProducts(username){
        try{
            return await cart.find({username:username}).toArray()
        } 
        catch(e){
            console.log(e)
        }
    }


    static async getCartProduct(username, productId){
        try{
            const response =  await cart.findOne({
                username:username, 
                product_id: productId
            })
            if(response){
                return response
            }
            else return null
        } 
        catch(e){
            console.log(e)
        }
    }


    static async deleteCartProduct(username, productId){
        try{
            return await cart.deleteOne({
                username: username, 
                product_id: productId
            })
        } 
        catch(e){
            console.log(e)
        }
    }
}