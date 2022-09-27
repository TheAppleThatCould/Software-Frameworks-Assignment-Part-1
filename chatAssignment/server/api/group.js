var fs = require('fs');
const user = require('./user');

module.exports = {
    getGroups: function(db, app){
        app.get('/getGroups', function(req, res){
            const collection = db.collection('groups');

            collection.find({}).toArray((err, data) => {
                console.log("getGroups: ", data)
                res.send(data);
            })
        })
    },
    addUserToGroup: function(db, app){
        app.post('/addUserToGroup', function(req, res){
            const collection = db.collection('groups');

            let userID = req.body.userID;
            let groupID = req.body.groupID;
            console.log(userID, " ", parseInt(groupID))

            //TODO: come back later and check for duplicates.
            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                console.log("data: ", data)
                data[0].userID.push(userID)

                collection.updateOne({id: groupID}, {$set: {userID: data[0].userID}})
                res.sendStatus(200);
            })
        })
    },
    deleteGroup: function(db, app){
        app.post('/deleteGroup', function(req, res){
            const collection = db.collection('groups');

            let groupID = req.body.groupID;
            console.log(parseInt(groupID))


            collection.deleteOne({id: parseInt(groupID)});
            res.sendStatus(200);
        })
    },
    removeUserFromGroup: function(db, app){
        app.post('/removeUserFromGroup', function(req, res){
            const collection = db.collection('groups');

            let userID = req.body.userID;
            let groupID = req.body.groupID;
            console.log(parseInt(groupID))

            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                console.log("data: ", data)
                let newUserArray = []

                data[0].userID.map(el => {
                    if(el != userID){
                        newUserArray.push(el)
                    }
                })
                console.log(newUserArray)                    

                collection.updateOne({id: parseInt(groupID)}, {$set: {userID: newUserArray}})
                res.sendStatus(200);
            })
        })
    },

    getGroupsByUserID: function(db, app){
        // Get all the groups that the user is a part of
        app.post('/getGroupsByUserID', function(req, res){
            const collection = db.collection('groups');
            let userID = req.body.userID;

            collection.find({}).toArray((err, data) => {
                let groups = []
                data.map(groupEl => {
                    groupEl.userID.map(el => {
                        if(el == userID){
                            groups.push(groupEl)
                        }
                    })
                })              
                res.send(groups);
            })
        })
    },

    getGroupsByGroupName: function(db, app){
        //TODO: double check this is working
        app.post('/getGroupsByGroupName', function(req, res){
            const collection = db.collection('groups');
            let groupName = req.body.groupName;

            collection.find({name: groupName}).toArray((err, data) => {
                if (err) throw err;
                res.send(data);
            })
        })
    },


    getGroupsByGroupID: function(db, app){
        //TODO: double check this is working
        app.post('/getGroupsByGroupID', function(req, res){
            const collection = db.collection('groups');
            let groupID = req.body.groupID;

            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                if (err) throw err;
                console.log("This is the group by groupID" + data[0])
                res.send(data[0]);
            })
        })
    },

    
    
    createGroup: function(db, app){
        //TODO: double check this is working
        app.post('/createGroup', function(req, res){
            const collection = db.collection('groups');
            let group = req.body;

            // Get the last element in the groups collection and increment the id by 1 then add it to the new group.
            collection.find().sort({id: -1}).limit(1).toArray((err, data) =>{
                group.id = data[0].id + 1

                collection.insertOne(group, (err, dbres) => {
                    if (err) throw err;
                    res.sendStatus(200)
                })
            });

        })
    },
    
    
    // function(req, res){
    //     fs.readFile("./data/groups.json", 'utf8', function(err, data){
    //         if (err) throw err;
    //         let groupArray = JSON.parse(data);
    //         let validGroup = true;

    //         groupArray.groups.map((el) => {
    //             if(el.name == req.body.name || el.groupID == req.body.groupID){
    //                 validGroup = false
    //             }
    //         })

    //         groupArray.groups.push(req.body)

    //         if(validGroup){
    //             fs.writeFile("./data/groups.json", JSON.stringify(groupArray), function(err){
    //                 if (err) throw err;
    //             })
    //             res.send(true);
    //         } else {
    //             res.send(false);
    //         }
    //     })
    // },


    updateGroupAdmin:  function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupsData = [];
            let userID = req.body.userID;

            groupArray.groups.map((el) => {
                if(el.groupID == req.body.groupID){
                    el.adminID = userID
                    groupsData.push(el)
                }
                else{
                    groupsData.push(el)
                }
            })

            fs.writeFile("./data/groups.json", JSON.stringify({groups:groupsData}), function(err){
                if (err) throw err;
            })
            res.send(true);

        })
    },
    updateGroupAssistant: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupsData = [];
            let groupobject = req.body;

            groupArray.groups.map((el) => {
                if(el.groupID == req.body.groupID){
                    groupsData.push(groupobject)
                }
                else{
                    groupsData.push(el)
                }
            })

            fs.writeFile("./data/groups.json", JSON.stringify({groups: groupsData}), function(err){
                if (err) throw err;
            })
            res.send(true);
        })
    },
};