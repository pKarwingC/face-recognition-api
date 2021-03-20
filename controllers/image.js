import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '5c3b2d28107b422bb8a6140e7d7c70e3'
});

const handleImageApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(response => {
            return res.json(response);
        })
        .catch(err => {
            console.log('error: ', err);
            res.status(400).json('failed to get image');
        });
};

const handleImage = (req, res, pgdb)=> {
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
};

export {handleImage, handleImageApiCall};