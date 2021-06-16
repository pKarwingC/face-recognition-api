import { redisClient } from "./signin.js";

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(401).json('Unauthorized');
    }
    redisClient.get(authorization, (err, reply)=>{
        if(err || !reply){
            return res.status(401).json('Unauthorized');
        }
        console.log('you are authorized');
        return next();
    })
};

export default requireAuth;