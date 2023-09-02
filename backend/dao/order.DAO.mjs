import mongodb from "mongodb"

let orders
export default class OrderDao {

    static async injectDB(client){
        if(orders)
            return
        try {
            
            orders = await client.db("users").collection("orders")
           
        }
        catch(e){
            console.error("Unable to establish connection with db: ", e)
        }
    }   



    static async postOrder(paymentDate, paymentId, username, email, fullname, address, products, grandTotal, orderStatus){
        try{ 
            console.log("paymentDate in dao:", paymentDate)
            const orderData = {  
                payment_date: paymentDate,
                payment_id: paymentId,
                payer_username: username,
                payer_email: email,
                payer_fullName: fullname,
                payer_fullAddress: address,
                purchased_products: products,
                grand_total: grandTotal,
                order_status: orderStatus
            }

            return await orders.insertOne(orderData)
        }
        catch(e){
            console.log(e)
        }
    }


    static async getUserOrders(username) {
        try{
            const response = await orders.find({payer_username: username}).toArray()
            return response
        }
        catch(e){
            console.log(e)
        }
    }
  
    static async getPendingOrders() {
        try{
            const query = "Pending"
            const response = await orders.find({order_status: query}).toArray()
            return response
        }
        catch(e){
            console.log(e)
        }
    }
  
    static async updateOrder(orderId, updatedStatus){
        try{
            const query = {payment_id: orderId}
            const update = {$set: {order_status: updatedStatus}}
            const response = await orders.updateOne(query, update)
            return response
        }
        catch(e){
            console.log(e)
        }
    }
    

    
}