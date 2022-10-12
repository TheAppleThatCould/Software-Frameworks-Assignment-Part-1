module.exports = {
    // Get all groups
    getGroups: function(db, app){
        app.get('/getGroups', function(req, res){
            const collection = db.collection('groups');

            collection.find({}).toArray((err, data) => {
                res.send(data);
            })
        })
    },
    // Add user to a group based on the userID and groupID
    addUserToGroup: function(db, app){
        app.post('/addUserToGroup', function(req, res){
            const collection = db.collection('groups');

            let userID = req.body.userID;
            let groupID = req.body.groupID;

            //TODO: come back later and check for duplicates.
            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                data[0].userID.push(userID)

                collection.updateOne({id: groupID}, {$set: {userID: data[0].userID}})
                res.sendStatus(200);
            })
        })
    },
    // Delete the group based on the groupID
    deleteGroup: function(db, app){
        app.post('/deleteGroup', function(req, res){
            const collection = db.collection('groups');

            let groupID = req.body.groupID;

            collection.deleteOne({id: parseInt(groupID)});
            res.sendStatus(200);
        })
    },
    // Remove user from a group based on the groupID and userID
    removeUserFromGroup: function(db, app){
        app.post('/removeUserFromGroup', function(req, res){
            const collection = db.collection('groups');

            let userID = req.body.userID;
            let groupID = req.body.groupID;

            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                let newUserArray = []

                data[0].userID.map(el => {
                    if(el != userID){
                        newUserArray.push(el)
                    }
                })               

                collection.updateOne({id: parseInt(groupID)}, {$set: {userID: newUserArray}})
                res.sendStatus(200);
            })
        })
    },
    // Get all groups based on the userID
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
    // Get group based on the group name
    getGroupsByGroupName: function(db, app){
        app.post('/getGroupsByGroupName', function(req, res){
            const collection = db.collection('groups');
            let groupName = req.body.groupName;

            collection.find({name: groupName}).toArray((err, data) => {
                if (err) throw err;
                res.send(data);
            })
        })
    },

    // Get group based on the groupID
    getGroupsByGroupID: function(db, app){
        app.post('/getGroupsByGroupID', function(req, res){
            const collection = db.collection('groups');
            let groupID = req.body.groupID;

            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                if (err) throw err;
                res.send(data[0]);
            })
        })
    },
    // Create group based on a group object
    createGroup: function(db, app){
        app.post('/createGroup', function(req, res){
            const collection = db.collection('groups');
            let group = req.body;
            let valid = true;

            // Get the last element in the groups collection and increment the id by 1 then add it to the new group.
            collection.find().sort({id: -1}).limit(1).toArray((err, data) =>{
                group.id = data[0].id + 1
                
                data.map(el =>{
                    // Checks for duplicates
                    if(group.name == el.name){
                        valid = false;
                    }
                })

                if(valid){
                    collection.insertOne(group, (err) => {
                        if (err) throw err;
                        res.sendStatus(200)
                    })
                }
            });

        })
    },
    // Update the group admin based on a userID and groupID
    updateGroupAdmin: function(db, app){
        app.post('/updateGroupAdmin', function(req, res){
            const collection = db.collection('groups');

            let userID = req.body.userID;
            let groupID = req.body.groupID;
            
            collection.updateOne({id: groupID}, {$set: {adminID: userID}})
            res.sendStatus(200);
        })
    },
    // Update the group assistant based on a group object
    updateGroupAssistant: function(db, app){
        app.post('/updateGroupAssistant', function(req, res){
            const collection = db.collection('groups');
            let group = req.body;
       
            collection.updateOne(
                {'id': group.id},
                {
                    $set: {
                        'id': req.body.id,
                        'name': req.body.name,
                        'userID': req.body.userID,
                        'adminID': req.body.adminID,
                        'assistantID': req.body.assistantID,
                    }
                }
            );
            res.sendStatus(200)
        })
    },
};