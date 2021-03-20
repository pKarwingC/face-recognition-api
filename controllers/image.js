
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

export default handleImage;