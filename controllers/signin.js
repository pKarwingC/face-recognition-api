import jwt from "jsonwebtoken";
import redis from "redis";

export const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (req, res, pgdb, bcrypt)=> {
    const { email, password } = req.body
    if(!email || !password){
        return Promise.reject('incorrect form submission');
    }
    return pgdb.select('email', 'hash').from('login')
        .where({
            email: req.body.email
        })
        .then(data =>{
            const validPass = bcrypt.compareSync(req.body.password, data[0].hash);
            if(validPass){
                return pgdb.select('*').from('users')
                    .where({
                        email: email
                    })
                    .then(users => users[0])
                    .catch(err => Promise.reject('cannot find user'));
            }else{
                return Promise.reject("password and email not match");  
            }
        })
        .catch(err => Promise.reject("cannot find user with the email"));
};

const getAuthTokenId = (req, res)=>{
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply)=>{
        if(err || !reply){
            return res.status(401).json('Unauthorized');
        }
        return res.json({id: reply});
    });
};

const signToken = (email)=>{
    const jwtPayload = {email};
    const jwtSignature = jwt.sign(jwtPayload, process.env.JWT_TOKEN);
    return jwtSignature;
};

const setToken = (token, id)=> {
    return Promise.resolve(redisClient.set(token, id));
};

const createSessions = (user)=>{
    const {email, id} = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(()=>({success: true, userId: id, token}))
        .catch(err => console.log(err));
};

const signinAuthentication = (pgdb, bcrypt)=> (req, res) => {
    const {authorization} = req.headers;
    return authorization ? getAuthTokenId(req, res) : 
        handleSignin(req, res, pgdb, bcrypt)
        .then(data => {
            return (data.id && data.email) ? createSessions(data): Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => (res.status(400).json(err)));
};

export default signinAuthentication;