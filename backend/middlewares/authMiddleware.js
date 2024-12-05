const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const authenticate = (req,res,next) => {
    // Extracts token from header ( In header it is Bearer Token so thats why use split)
    const token = req.header('Authorization')?.split(' ')[1];  
    if(!token){
        return res.status(401).json({
            error: 'Access denied. No token provided.',
        });
    }

    // Verify token
    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                error: 'Invalid or Expired token.',
            })
        }
        // adds the decoded user data to requests
        req.user = decoded;
        // proceeds to next handler(api route)
        next();
    });
}

module.exports = {
    authenticate
}