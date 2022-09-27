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
    
    // function(req, res){
    //     fs.readFile("./data/groups.json", 'utf8', function(err, data){
    //         if (err) throw err;
    //         let groupArray = JSON.parse(data);
    //         let groupsData = [];
    //         let groupID = req.body.groupID;

    //         groupArray.groups.map(el =>{
    //             if(el.groupID != groupID){
    //                 groupsData.push(el)
    //             }
    //         })
    //         fs.writeFile("./data/groups.json", JSON.stringify({groups: groupsData}), function(err){
    //             if (err) throw err;
    //             else {
    //                 res.send(true);
    //             }
    //         })
    //     })
    // },
    removeUserFromGroup:  function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupsData = [];
            let userID = req.body.userID;
            let groupID = req.body.groupID;

            groupArray.groups.map(el =>{
                if(el.groupID == groupID){
                    el.userID.map((userIDInGroup, index) => {
                        if(userIDInGroup == userID){
                            el.userID.splice(index,1)
                        } 
                    })
                }
                groupsData.push(el)
            })

            fs.writeFile("./data/groups.json", JSON.stringify({groups: groupsData}), function(err){
                if (err) throw err;
                else {
                    res.send(true);
                }
            })
        })
    },

    getGroupDetailsByUserID: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;

            let groupArray = JSON.parse(data);
            let groupsData = [];
            let userID = req.body.userID;
            
            groupArray.groups.map((el) => {
                el.userID.map((groupUserID) => {
                    if(groupUserID == userID){
                        groupsData.push(el)
                    }
                })
            })
            res.send(groupsData);
        })
    },
    getGroupsByGroupName: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupData = {};
            let groupName = req.body.groupName;
            
            groupArray.groups.map((el) => {
                if(el.name == groupName){
                    groupData = el;
                }
            })

            res.send(groupData);
        })
    },
    getGroupsByGroupID: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupData = {};
            let groupID = req.body.groupID;
            
            groupArray.groups.map((el) => {
                if(el.groupID == groupID){
                    groupData = el;
                }
            })

            res.send(groupData);
        })
    },
    createGroup: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let validGroup = true;

            groupArray.groups.map((el) => {
                if(el.name == req.body.name || el.groupID == req.body.groupID){
                    validGroup = false
                }
            })

            groupArray.groups.push(req.body)

            if(validGroup){
                fs.writeFile("./data/groups.json", JSON.stringify(groupArray), function(err){
                    if (err) throw err;
                })
                res.send(true);
            } else {
                res.send(false);
            }
        })
    },
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