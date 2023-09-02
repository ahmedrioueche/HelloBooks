import UsersDAO from "../dao/users.DAO.mjs"
import bcrypt from "bcrypt"

export default class UsersCtrl {

    static async apiPostUserData(req, res, next){
        try{
            const username = req.body.username
            const email = req.body.email
            const password = req.body.password   
            const accountType = req.body.type

            const response = await UsersDAO.addUser(username, email, password, accountType)
            res.json(response)
        }
        catch(e){
            res.status(500).json({
                "Couldn't add user": e
            })
        }
    }


    static async apiGetUser(req, res, next){
        try {
            const username = req.params.username
            const response = await UsersDAO.getUser(username)
            if(response){
                console.log(response)
                res.json(response)
            }
            else {
                res.status(404).json({ error: "User not found" })
            }            
        }
        catch(e){
            res.status(500).json({error: e.message})
        }     
    }   


    static async apiGetUserByEmail(req, res, next){
        try {
            const email = req.params.email
            const response = await UsersDAO.getUserByEmail(email)
            if(response){
                console.log(response)
                res.json(response)
            }
            else {
                res.status(404).json({ error: "User not found" })
            }            
        }
        catch(e){
            res.status(500).json({error: e.message})
        }     
    }   


    static async apiGetUsers(req, res, next){
        try{
            const response = await UsersDAO.getUsers()
            if(response){
                console.log(response)
                res.json(response)
            }
            else {
                res.status(404).json({ error: "Couldnt get users" })
            }            
        }
        catch(e){
            res.status(500).json({error: e.message})
        }          
    }



    static async apiDeleteUser(req, res, next){
        try{
            const username = req.params.username
            const response = await UsersDAO.deleteUser(username)  
            res.json(response)
            if(response.deletedCount > 1 )
                console.log("User was delete successfully")        
            else 
                console.log("Unable to delete user in api")     
        }
        catch(e){
            console.log("Error", e)
        }
    }



    static async apiVerifyPassword(req, res, next){
        try{
            const password = req.params.password
            const hashedPassword = req.params.hashedPassword
            const response = await UsersDAO.verifyPassword(password, hashedPassword)  
            res.json(response)
        }
        catch(e){
            console.log(e)
        }
    }
}

