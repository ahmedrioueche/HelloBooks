const API_LINK = "http://localhost:8000/api/v1/hello-books"

export default class DashboardService{


    static async updateUserCount(addedUser){
        try{
            const data = await DashboardService.getDashboardData()   
            if(addedUser){
                data[0].users = data[0].users + 1
            }
            else {
                data[0].users = data[0].users - 1
            }
            data[0].total_accounts = data[0].users + data[0].admins
           await DashboardService.updateDashboardData(data[0])
        }
        catch(e){
            console.log(e)
        }
    }


    static async getDashboardData(){

        const response = await fetch(API_LINK+"/dash/get-dashboard")
        if(response.ok){
            const data = await response.json()
            return data
        }
        else console.log("result is not ok")
    }

    

    static async updateDashboardData(data){

        const link = API_LINK + "/dash/update-dashboard"

        const updateData = {}
        if (data.pending !== null) 
            updateData.pending = data.pending;

        if (data.payments !== null) 
            updateData.payments = data.payments;
        
        if (data.orders !== null) 
            updateData.orders = data.orders;
        
        if (data.products !== null) 
            updateData.products = data.products;
        
        if (data.users !== null) 
            updateData.users = data.users;
        
        if (data.admins !== null) 
            updateData.admins = data.admins;
        
        if (data.total_accounts !== null) 
            updateData.total_accounts = data.total_accounts;
        
        if (data.messages !== null) 
            updateData.messages = data.messages;
        
        console.log("updateData", updateData)
        const response = await fetch(link, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/JSON'
            },
            body: JSON.stringify({updateData})
        })
        if(response.ok){
            console.log("Update successful")
        }
        else {
            console.log("Update failed")
        }
    }

}