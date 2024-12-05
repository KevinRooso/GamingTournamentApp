const userModel = require('../models/user');

const getAllUsers = async(req,res) => {
    try{
        const users = await userModel.getAllUsers();
        // User list if successful
        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });
    }catch(err){
        // Error Handling
        res.status(500).json({
            message: 'Error retrieving users',
            error: err.message
        });
    }
}

const getUserDetailsById = async(req,res) => {
    try{
        const id = req.params.id;
        const user = await userModel.getUserDetailsById(id);

        if(!user){
            res.status(404).json({
                message: 'User does not exist'
            });
        }
        
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({
            message: 'Error retrieving user',
            error: err.message
        })
    }   
}

module.exports = {
    getAllUsers,
    getUserDetailsById
}