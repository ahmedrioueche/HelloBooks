import DashboardDAO from "../dao/dashboard.DAO.mjs"

export default class DashboardCtrl {

    static async apiUpdateDashboard(req, res, next){
        try{
            const data = {
                pending: req.body.updateData.pending,
                payments: req.body.updateData.payments,
                orders: req.body.updateData.orders,
                products: req.body.updateData.products,
                users: req.body.updateData.users,
                admins: req.body.updateData.admins,
                total_accounts: req.body.updateData.total_accounts,
                messages: req.body.updateData.messages,
            }
            
            const response = await DashboardDAO.updateDashboard(data)
            if(response)
            res.json({res: response})
        }
        catch(e){
            console.error("Could not update dashboard:", e)
         }
}


    static async apiGetDashboardData(req, res, next){

        try {
            const response = await DashboardDAO.getDashboardData()
            res.json(response)
        }
        catch(e){
            console.error("Could not get dashboard data:", e)
        }
    }
}