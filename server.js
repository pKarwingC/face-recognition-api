import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'Sally',
            email: 'sally@hotmail.com',
            password: 'password',
            entries: 0,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'Polly',
            email: 'polly@hotmail.com',
            password: 'password',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=> {
    res.send(database.users);
});

app.post('/signin', (req, res)=> {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    }
    else{
        res.status(400).json("signin failed")
    }
});

app.post('/register', (req, res)=> {
    const {email, password, name} = req.body;
    database.users.push({
        id: '1234',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res)=> {
    const {id} = req.params;
    const ids = database.users.filter((v)=>{return v.id == id});
    if(ids.length > 0){
        res.json(ids[0]);
    }
    else{
        res.status(400).send("profile not found");
    }
});

app.put('/image', (req, res)=> {
    const {id} = req.body;
    const ids = database.users.filter((v)=>{return v.id == id});
    if(ids.length > 0){
        res.json((ids[0].entries++));
    }
    else{
        res.status(400).send("profile not found");
    }
});

app.listen(3000, ()=> {
    console.log('app is running!!!');
});
