const jwt = require('jsonwebtoken');
const userModel = require('../models/user')

const registerUser = async(req,res)=>{
    try{
        // Checks for existing user
        const existingUser = await userModel.findOne({
            where: {
                username: req.body.username
            }
        });
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }

        const newUser = { 
            roleId: 2,
            roleName: 'User',
            ...req.body            
        }

        const newUserId = await userModel.create(newUser);
        const token = jwt.sign({id: newUserId, roleId: 2}, process.env.JWT_SECRET, { expiresIn: '1h'});
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
        });
    }catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const loginUser = async (req,res) =>{
    const { username, password } = req.body;
    try{
        // Check if it exists or not    
        const existingUser = await userModel.findOne({
            where: {username}
        });
        if(!existingUser){
            return res.status(400).json({message: 'Invalid username or password'});
        }

        // Compare password to stored hashed password
        const isValidPassword = await userModel.comparePassword(password,existingUser.password);
        if(!isValidPassword){
            return res.status(400).json({message: 'Invalid username or password'});
        }

        // Generate Token
        const token = jwt.sign({id: existingUser.id, roleId: existingUser.roleId}, process.env.JWT_SECRET,{expiresIn: '1h'});

        // Send response to Token
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    }
    catch(error){
        res.status(500).json({message: 'Server error',error: error.message});
    }
};

module.exports = {
    registerUser,
    loginUser
};