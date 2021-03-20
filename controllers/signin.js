
const handleSignin = (req, res, pgdb, bcrypt)=> {
    pgdb.select('email', 'hash').from('login')
        .where({
            email: req.body.email
        })
        .then(data =>{
            const validPass = bcrypt.compareSync(req.body.password, data[0].hash);
            if(validPass){
                pgdb.select('*').from('users')
                    .where({
                        email: req.body.email
                    })
                    .then(users =>{
                        res.json(users[0]);
                    })
                    .catch(err =>{
                        res.status(400).json('cannot find user');
                    });
            }else{
                res.status(400).json("password and email not match");  
            }
        })
        .catch(err => res.status(400).json("cannot find user with the email"));
};

export default handleSignin;