import mongodb from "mongodb"
import bcrypt from "bcrypt"
const ObjectId = mongodb.ObjectId
const saltRounds = 10


let users
export default class UsersDAO {

    static async injectDB(client){
        if(users)
            return
        try {
            users = await client.db("users").collection("users")
        }
        catch(e){
            console.error("Unable to establish connection with db:", e)
        }
    }



    static async addUser(username, email, password, accountType){
        try { 

            const hashedPassword = await UsersDAO.hashPassword(password)
            const newUser = await users.insertOne({
                username,
                email,
                password: hashedPassword,
                type: accountType
            });
            console.log("newUser in dao:", newUser)
            return newUser
        }
        catch(e){
            console.error("Unable to insert user to db:", e)
            return {error: e}
        }
    }



    static async getUser(username){
        
        try {
            return await users.findOne({username : username})
        }
        catch(e){
            console.error("Unable to get user info from db:", e)
            return {error: e}
        }
    }


    static async  getUserByEmail(email){
        
        try {
            return await users.findOne({email : email})
        }
        catch(e){
            console.error("Unable to get user info from db:", e)
            return {error: e}
        }
    }


    static async getUsers(){
        try {
            return await users.find({}).toArray()
        }
        catch(e){
            console.error("Unable to get user info from db:", e)
            return {error: e}
        }
    }



    static async deleteUser(username){
        try{
            const response =  await users.deleteOne({username: username})
            if(response)
                console.log(response)
            else          
               console.error("Unable to delete user info from db")
        }
        catch(e){
            console.error("error:", e)
            return {error: e}
        }
    }

    
    //hash password
    static async hashPassword(password){
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(password, salt) 
    }



    static async verifyPassword(enteredPassword, storedHashedPassword) {
        try {
            return await bcrypt.compare(enteredPassword, storedHashedPassword);
        } catch (error) {
            console.error("Error verifying password:", error);
            throw error;
        }
    }
}