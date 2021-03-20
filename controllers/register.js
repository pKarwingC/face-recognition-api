
const handleRegister = (req, res, pgdb, bcrypt) => {
    const {email, password, name} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    pgdb.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return pgdb('users').insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .returning('*')
            .then(data => {
                res.json(data[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('Unable to register'));
};

export default handleRegister;