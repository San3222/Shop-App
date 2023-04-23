
const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
const authHeader =  req.headers.token;

if(authHeader){
    const token = authHeader.split(" ")[1]; 
    jwt.verify(token,process.env.JWT_SEC,(err,data) =>{
        if(err) res.status(403).json({message:"token is not valid"});
        req.user = data; 
        next();
    })
}else{
    return res.status(401).json({message:'you are not authenticated'})
}
};


const verifyTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
         next();
        } else{
            res.status(403).json('you are not allowed to do that');
        }
    })
}

const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res, () => {
        if( req.user.id ) {
         next();
        } else{
            res.status(403).json('you are not allowed ');
        }
    })
}

module.exports = { verifyToken , verifyTokenAndAuthorization , verifyTokenAndAdmin};