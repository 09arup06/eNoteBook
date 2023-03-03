var jwt = require('jsonwebtoken');
const jwtsecret = "YOwassupMyMan"
 
const fetchuser = (req,res,next)=>{
const token = req.header('logintoken')
if(!token){
    return res.status(401).json({ errors: "Please authenticate using a valid token" });
}
try {
    const string = jwt.verify(token,jwtsecret)
    req.id = string.id
    next();
} catch (error) {
    return res.status(401).json({ errors: "Please authenticate using a valid token" });
    
} 
}
module.exports = fetchuser;