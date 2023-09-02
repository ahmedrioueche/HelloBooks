import mongodb from "mongodb"


let dashboard
export default class DashboardDAO {

    static async injectDB(client){
        if(dashboard)
            return
        try {
            
            dashboard = await client.db("data").collection("dashboard")
           
        }
        catch(e){
            console.error("Unable to establish connection with db: ", e)
        }
    }   
    
    static async updateDashboard(data){
        try {
            const filter = {}

            const updateQuery = {
                $set: data
            }
    
            const result = await dashboard.updateMany(filter, updateQuery)
            return result.modifiedCount
        }
        catch(e){
            console.error("Unable to update dashboard in db")
        }
     
    }

    static async getDashboardData(){
       
        try{
            const result = await dashboard.find({}).toArray()
            return result
        }
        catch(e){
            console.error("Unable to get dashboard data in db")
        }
    }
        
}