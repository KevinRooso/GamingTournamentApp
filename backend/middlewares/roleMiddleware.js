const authorize = (allowedRoles) => {
    return(req,res,next)=>{
        // Checks if user is authenticated
        if(!req.user || !req.user.roleId){
            return res.status(401).json({message: 'Unauthorized'});
        }
        
        // Checks if roleId is in list of allowed Roles 
        if(!allowedRoles.includes(req.user.roleId)){
            return res.status(403).json({
                error:'Access denied. You do not have the required permissions'
            });
        }

        // If allowed, it proceeds to next router step
        next();
    }    
};

module.exports = {
    authorize
};