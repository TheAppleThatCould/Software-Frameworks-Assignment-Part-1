var fs = require('fs')

module.exports = {
    getAllUsers: function(db, app){
        app.get('/getAllUsers', function(req, res){
            const collection = db.collection('users');

            collection.find({}).toArray((err, data) => {
                console.log("getAllUsers: ", data)
                res.send(data);
            })

        })
    },
    deleteUser: function(db, app){
        app.post('/deleteUser', function(req, res){

            if(!req.body){
                return res.sendStatus(400);
            }
            const userID = req.body.userID;
            const collection = db.collection('users');


            collection.deleteOne({id: userID});

            console.log("Delete! userID: ", userID);
            res.sendStatus(200);
        })
    },
    getUserByUserName: function(db, app){
        app.post('/getUserByUserName', function(req, res){

            if(!req.body){
                return res.sendStatus(400);
            }
            const userName = req.body.userName;
            const collection = db.collection('users');

            console.log("userName: ", userName);

            collection.find({'userName': userName}).toArray((err, data) => {
                res.send(data[0])
            })
        })
    },
    updateUser: function(db, app){
        app.post('/updateUser', function(req, res){

            if(!req.body){
                return res.sendStatus(400);
            }
            const userName = req.body.userName;
            const collection = db.collection('users');

            console.log("req.body: ", req.body);

            
            collection.update(
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
    createUser: function(req, res){
        fs.readFile("./data/users.json", 'utf8', function(err, data){
            if (err) throw err;

            let userArray = JSON.parse(data);
            let validUser = true;

            //Check if there is already a user with that userName and password
            userArray.userDetails.map((el) => {
                if(el.userName == req.body.userName || el.userID == req.body.userID){
                    validUser = false
                }
            })

            userArray.userDetails.push(req.body)

            if(validUser){
                fs.writeFile("./data/users.json", JSON.stringify(userArray), function(err){
                    if (err) throw err;
                })
                console.log("User is valid")
                res.send(true)
            }else {
                console.log("User not valid")
                res.send(false)
            }
        })
    },
};