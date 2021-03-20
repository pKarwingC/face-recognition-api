import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors());

const pgdb = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'face-recognition'
    }
});

app.get('/', (req, res)=> {
    pgdb.select('*').from('users')
        .then(users =>{
            res.json(users);
        })
        .catch(err =>{
            res.status(400).json('users not found');
        })
});

app.post('/signin', (req, res)=> {
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
});

app.post('/register', (req, res)=> {
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
});

app.get('/profile/:id', (req, res)=> {
    const {id} = req.params;
    pgdb.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
});

app.put('/image', (req, res)=> {
    const {id} = req.body;
    pgdb.select('*').from('users').where({
        id: id
    })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if(entries){
            res.json(entries[0]);
        }
        else{
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
});

app.listen(3000, ()=> {
    console.log('app is running!!!');
});
