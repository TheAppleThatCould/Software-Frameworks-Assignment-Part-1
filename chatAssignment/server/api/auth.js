module.exports = {
    // A function that will recieve the user detail based on the userName and password which was passed through.
    login: function(db, app){
        app.post('/login', function(req, res){
            if(!req.body){
                return res.sendStatus(400);
            }
            let userName = req.body.userName; 
            let password = req.body.password;

            const collection = db.collection('users');

            collection.find({$and: [{"userName": {$eq: userName}}, {"password": {$eq: password}}]}).toArray((err, data) => {
                res.send(data[0])
            })

        })
    }
}