import CartDao from "../dao/cart.DAO.mjs"

export default class CartCtrl {
    static async apiaddProductToCart(req, res, next){
        try{
            const username = req.body.username
            const productId = req.params.productId  
            const quantity =  req.body.quantity
            const response =  await CartDao.addProductToCart(username, productId, quantity)
            if(response){
                res.json(response)
                console.log(response)
            }
        }catch(e){
            console.log(e)
        }
    }

    static async apigetAllCartProducts(req, res, next){
        try{
            const response = await CartDao.getAllCartProducts()
            if(response){
                res.json(response)
                console.log(response)
            }
        }
        catch(e){
            console.log(e)
        }

    }

    static async apigetCartProducts(req, res, next){
        try{
            const username = req.params.username
            const response = await CartDao.getCartProducts(username)
            if(response){
                res.json(response)
                console.log(response)
            }
        }
        catch(e){
            console.log(e)
        }
    } 


    static async apigetCartProduct(req, res, next){
        try{
            const username = req.params.username
            const productId = req.params.productId
            const response = await CartDao.getCartProduct(username, productId)
            res.json(response)
            console.log(response)

        }
        catch(e){
            console.log(e)
        }
    }


    static async apideleteCartProduct(req, res, next){
        try{
            const username = req.params.username
            const productId = req.params.productId
            const response = await CartDao.deleteCartProduct(username, productId)
            if(response){
                res.json(response)
                console.log(response)
            }
        }
        catch(e){
            console.log(e)
        }
    }
}