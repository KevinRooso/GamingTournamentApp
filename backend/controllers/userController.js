const userModel = require('../models/user');

const getAllUsers = async(req,res) => {
    try{
        const users = await userModel.findAll({
            where: { roleId: 2} // Only retrives users with roleId 2
        });

        const usersWithoutPassword = users.map((user)=>{
            const {password, ...userWithoutPassword} = user.toJSON();
            return userWithoutPassword;
        });
        // User list if successful
        res.status(200).json({
            message: "Users retrieved successfully",
            data: usersWithoutPassword
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
        const user = await userModel.findOne({
            where: {id}
        });

        if(!user){
            res.status(404).json({
                message: 'User does not exist'
            });
        }

        const { password, ...userWithoutPassword } = user.toJSON();
        
        res.status(200).json(userWithoutPassword);
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