import ProductsDAO from "../dao/products.DAO.mjs"

export default class ProductCtrl {
    static async apiAddProduct(req, res, next){
        try{
            const  productName = req.body.product_name
            const  productPrice = req.body.product_price
            const  productCopies = req.body.product_copies
            const  productImgSrc = req.body.product_img_src

            const response = await ProductsDAO.addProduct(productName, productPrice, productCopies, productImgSrc)
            if(response){
                res.json(response)
                console.log(response)
            }
               
            else console.log("error")
        }
        catch(e){
            console.log(e)
        }
 
    }

    static async apigetProducts(req, res, next){
        try{
            const response = await ProductsDAO.getProducts()
            if(response)
                res.json(response)
            else console.log("error")
        }
        catch(e){
            console.log(e)
        }
    }



    static async apigetProduct(req, res, next){
        try{
            const productId = req.params.productId            
            const response = await ProductsDAO.getProduct(productId)
            res.json(response)        
        }
        catch(e){
            console.log(e)
        }
    }



    static async apiDeleteProduct(req, res, next){
        try{
            const productId = req.params.productId
            const response = await ProductsDAO.deleteProduct(productId)
            if(response){
                res.json(response)
                if(response.deletedCount > 0 )
                    console.log("Product deleted succesfully")
                else console.log("Delete Failed")
            }
        }
        catch(e){
            console.log(e)
        }
    }

    
    static async apiUpdateProduct(req, res, next){ 
        try{
            const productData = {
                _id: req.params.productId,
                product_name: req.body.product_name,
                product_price:req.body.product_price,
                product_copies: req.body.product_copies,
                product_img_src:  req.body.product_img_src
            }
             
            const response = await ProductsDAO.updateProduct(productData)
            if(response){
                res.json(response)
                if(response.updatedCount > 0)
                    console.log("Success")
                else 
                    console.log("Failure")
            }
        }
        catch(e){
            console.log(e)
        }
    }
}