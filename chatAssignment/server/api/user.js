module.exports = {
    // Get all users in the users collection in the mongodb database
    getAllUsers: function(db, app){
        app.get('/getAllUsers', function(req, res){
            const collection = db.collection('users');

            collection.find({}).toArray((err, data) => {
                if(!data){
                    res.send("");
                } else{
                    res.send(data);
                }
            })

        })
    },
    // Delete the user based on the parameter userID
    deleteUser: function(db, app){
        app.post('/deleteUser', function(req, res){

            if(!req.body){
                return res.sendStatus(400);
            }
            const userID = req.body.userID;
            const collection = db.collection('users');

            collection.deleteOne({id: userID}).then(() => {
                res.sendStatus(200);
            });
        })
    },
    //Get user based on the param userName stringc
    getUserByUserName: function(db, app){
        app.post('/getUserByUserName', function(req, res){

            if(!req.body){
                return res.sendStatus(400);
            }
            const userName = req.body.userName;
            const collection = db.collection('users');

            collection.find({'userName': userName}).toArray((err, data) => {
                res.send(data[0])
            })
        })
    },
    // Update the user based on the param userID
    updateUser: function(db, app){
        app.post('/updateUser', function(req, res){

            if(!req.body){
                return res.sendStatus(400);
            }
            const userName = req.body.userName;
            const collection = db.collection('users');


            collection.updateOne(
                {'userName': userName},
                {
                    $set: {
                        'userName': req.body.userName,
                        'birthDate': req.body.birthDate,
                        'age': req.body.age,
                        'email': req.body.email,
                        'password': req.body.password,
                        'role': req.body.role,
                        'valid': req.body.valid,
                    }
                }
            );
            res.sendStatus(200)
        })
    },
    // Create user in database
    createUser: function(db, app){
        app.post('/createUser', function(req, res){
            if(!req.body){
                return res.sendStatus(400);
            }
            const user = req.body;
            const collection = db.collection('users');
            let alreadyExist = false;

            collection.find({}).toArray((err, data) => {
                data.map(el =>{
                    if(el.userName == user.userName){
                        alreadyExist = true
                    }
                })
                    
                // Create the user if the userName is unique
                if(!alreadyExist){
                    collection.find().sort({id: -1}).toArray((err, data) => {
                        user.id = data[0].id + 1;
                        user.valid = true;
                        user.role = "normal";
                        user.imageURL = "null";
                        user.birthDate = "null";
                        user.age = 1;
        
                        collection.insertOne(user, (err, dbres) => {
                            if (err){
                                throw err
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    });
                } else {
                    res.sendStatus(200);
                }


            })
        })
    },

    // Update the user avatar image string with the imageURL parameter
    updateUserAvatar: function(db, app){
        app.post('/updateUserAvatar', function(req, res){
            if(!req.body){
                return res.sendStatus(400);
            }
            
            const userID = req.body.userID;
            const imagePath = req.body.imagePath;
            const collection = db.collection('users');
            collection.updateOne({id: parseInt(userID)}, {$set: {imageURL: imagePath}})

            return res.sendStatus(200);

        })
    }
};