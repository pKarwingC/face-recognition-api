import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";
import handleRegister from "./controllers/register.js";
import signinAuthentication from "./controllers/signin.js";
import handleProfile, {handleProfileUpdate} from "./controllers/profile.js";
import {handleImage, handleImageApiCall} from "./controllers/image.js";
import requireAuth from "./controllers/authorization.js";

const app = express();
app.use(express.json());
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const pgdb = knex({
    client: 'pg',
    // connection: {
    //     connectionString : process.env.DATABASE_URL,
    //     ssl: true
    // },
    connection: process.env.POSTGRES_URI
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

app.post('/signin', signinAuthentication(pgdb, bcrypt));
app.post('/register', (req, res)=> { handleRegister(req, res, pgdb, bcrypt) });
app.get('/profile/:id', requireAuth, (req, res)=> { handleProfile(req, res, pgdb) });
app.post('/profile/:id', requireAuth, (req, res)=> { handleProfileUpdate(req, res, pgdb) });
app.put('/image', requireAuth, (req, res)=> { handleImage(req, res, pgdb) });
app.post('/imageurl', requireAuth, (req, res)=> { handleImageApiCall(req, res) });

// app.listen(process.env.PORT || 3000, ()=> {
app.listen(3000, ()=> {
    console.log('app is running!!!');
});
