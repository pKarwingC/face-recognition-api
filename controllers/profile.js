
const handleProfile = (req, res, pgdb)=> {
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
};

export default handleProfile;