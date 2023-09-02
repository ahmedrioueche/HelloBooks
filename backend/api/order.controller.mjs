import OrderDao from "../dao/order.DAO.mjs"

export default class OrderCtrl {

    static async apiPostOrder(req, res, nexy){
        try{
            const paymentDate = req.body.payment_date
            const paymentId = req.body.payment_id
            const username = req.body.payer_username
            const email = req.body.payer_email
            const fullname = req.body.payer_fullName
            const address = req.body.payer_fullAddress
            const products = req.body.purchased_products
            const grandTotal = req.body.grand_total   
            const orderStatus = req.body.order_status
            const response = await OrderDao.postOrder(paymentDate, paymentId, username, email, fullname, address, products, grandTotal, orderStatus)
            res.json(response)
        }
        catch(e){   
              console.log(e)
        }
    }

    static async apiGetUserOrders(req, res, next){
        try{
            const username = req.params.username
            const response = await OrderDao.getUserOrders(username) 
            res.json(response)

        }      
        catch(e){   
            console.log(e)
        }
    }

    static async apiGetPendingOrders(req, res, next){
        try{
            const response = await OrderDao.getPendingOrders() 
            res.json(response)

        }      
        catch(e){   
            console.log(e)
        }
    }

    static async apiUpdateOrder(req, res, next){
        try{
            const orderId = req.params.order_id
            const updatedStatus = req.body.status
            const response = await OrderDao.updateOrder(orderId, updatedStatus ) 
            res.json(response)

        }      
        catch(e){   
            console.log(e)
        }
    }



}