
const handleProfile = (req, res, pgdb)=> {
    const {id} = req.params;
    pgdb.select('*').from('users').where({id})
    .then(user => {
        if(user){
            res.json(user[0]);
        }
        else{
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
};

export const handleProfileUpdate = (req, res, pgdb)=> {
    const {id} = req.params;
    const {name, email} = req.body.formInput;

    pgdb('users').where({id})
    .update({name, email})
    .then(user => {
        if(user){
            res.json('sucess');
        }
        else{
            res.status(400).json('Error updating user');
        }
    })
    .catch(err => res.status(400).json('Error updating user'));
};

export default handleProfile;