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


            collection.deleteOne({id: userID})

            console.log("Delete! userID")
            res.sendStatus(200)
        })
    },
    getUserByUserName: function(req, res){
        fs.readFile("./data/users.json", 'utf8', function(err, data){
            if (err) throw err;

            let userArray = JSON.parse(data);
            let userData = [];
            let userName = req.body.userName;
            userArray.userDetails.map((el) => {
                if(el.userName == userName){
                    userData.push(el);
                }
            })

            res.send(userData);
        })
    },
    updateUser: function(req, res){
        fs.readFile("./data/users.json", 'utf8', function(err, data){
            if (err) throw err;

            let userArray = JSON.parse(data);
            let userData = [];
            let userName = req.body.userName;

            userArray.userDetails.map((el) => {
                if(el.userName == userName){
                    userData.push(req.body);
                } else {
                    userData.push(el)
                }
            })

            fs.writeFile("./data/users.json", JSON.stringify({userDetails: userData}), function(err){
                if (err) throw err;
            })
            res.send(true)
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