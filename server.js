import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfile from "./controllers/profile.js";
import {handleImage, handleImageApiCall} from "./controllers/image.js";

const app = express();
app.use(express.json());
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const pgdb = knex({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: true
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

app.post('/signin', (req, res)=> { handleSignin(req, res, pgdb, bcrypt) });
app.post('/register', (req, res)=> { handleRegister(req, res, pgdb, bcrypt) });
app.get('/profile/:id', (req, res)=> { handleProfile(req, res, pgdb) });
app.put('/image', (req, res)=> { handleImage(req, res, pgdb) });
app.post('/imageurl', (req, res)=> { handleImageApiCall(req, res) });

app.listen(process.env.PORT || 3000, ()=> {
    console.log('app is running!!!');
});
