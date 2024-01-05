import {io} from "../index.js"
import { usersModel } from "../models/users.js"

export const getUsersAdmin = async (req,res)=>{
    const result = await usersModel.find()
    let usersArray = []
    result.forEach(u =>{
        usersArray.push({_id:u._id,first_name:u.first_name,last_name:u.last_name,email:u.email,role:u.role,last_connection:u.last_connection})
    })
    res.render("adminView",{usersArray})
}
