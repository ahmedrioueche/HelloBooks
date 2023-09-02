import DashboardService from "./dashboard.service.mjs"

const API_LINK = "http://localhost:8000/api/v1/hello-books"

export default class OrderService{
    //change updating to one function to avoid issues
    static async updateOrderCount(completed){
        try{
            const data = await DashboardService.getDashboardData()
            if(completed){
                data[0].pending = data[0].pending - 1 
            }
            else{   
                data[0].orders = data[0].orders + 1
                data[0].pending = data[0].pending + 1
            }
            await DashboardService.updateDashboardData(data[0])
        }
        catch(e){
            console.log(e)
        }
    }


    static async updatePayment(money){
        try{
            const data = await DashboardService.getDashboardData()
            data[0].payments += money
            await DashboardService.updateDashboardData(data[0])
        }
        catch(e){
            console.log(e)
        }
    }


    static async createOrder(date, orderData, username, email, products, total){
        try{
            const fullName = orderData.purchase_units[0].shipping.name.full_name
            const fullAddress = orderData.purchase_units[0].shipping.address
            const response = await fetch(API_LINK + "/orders/post-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },  
                body: JSON.stringify({
                    payment_date: date,
                    payment_id: orderData.id,
                    payer_username: username,
                    payer_email: email,  
                    payer_fullName: fullName,
                    payer_fullAddress: fullAddress,
                    purchased_products: products,
                    grand_total: total,
                    order_status: "Pending"
                })
            })
            if(response.ok){
                await OrderService.updateOrderCount(false) //true for completed, false for not completed 
                await OrderService.updatePayment(total)
            }
        }
        catch(e){
            console.log(e)
        }
    }


    static async updateProductCount(added){
        try{
            const data = await DashboardService.getDashboardData()
            if(added){
                data[0].products = data[0].products + 1
            }
            else {
                data[0].products = data[0].products - 1  
            }
            await DashboardService.updateDashboardData(data[0])
        }
        catch(e){
            console.log(e)
        }
    }
}
