import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let products


export default class ProductsDAO {

    static async injectDB(client){
        if(products)
            return
        try {            
            products = await client.db("products").collection("products")
        }
        catch(e){
            console.error("Unable to establish connection with db: ", e)
        }
    }   
    


    static async addProduct(productName, productPrice, productCopies, productImgSrc){
        try{
            const productData = {
                product_name: productName,
                product_price: productPrice,
                product_copies: productCopies,
                product_img_src: productImgSrc
            }
            return await products.insertOne(productData)
        }
        catch(e){
            console.log(e)
        }
    }



    static async getProducts(){
        try{
            return await products.find({}).toArray()
        }
        catch(e){
            console.log(e)
        }
    }



    static async getProduct(productId){ 
        try{
            const product = await products.findOne({_id : new ObjectId(productId)})
            if(product){
                return product
            }
            else {
                console.log("Product of id", productId, "doesnt exist" )
                return null
            }
        }
        catch(e){
            console.log(e)
        }
    }



    static async deleteProduct(productId){
        try{
            return await products.deleteOne({_id: new ObjectId(productId)})
        }
        catch(e){
            console.log(e)
        }
    }



    static async updateProduct(productData) {
        try{
            const query = {_id: new ObjectId(productData._id)}
            const updateData = {
                $set: {
                    product_name: productData.product_name,
                    product_price: productData.product_price,
                    product_copies: productData.product_copies,
                    product_img_src: productData.product_img_src
                }
            }
            return await products.updateOne(query, updateData)
        }
        catch(e){
            console.log(e)
        }
    }
}