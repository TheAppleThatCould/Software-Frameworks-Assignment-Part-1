var fs = require('fs')

module.exports = {
    getGroups: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupsData = [];

            groupArray.groups.map(el =>{
                groupsData.push(el)
            })

            res.send(groupsData);
        })
    },
    addUserToGroup: function(req, res){
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            let groupArray = JSON.parse(data);
            let groupsData = [];

            let userID = req.body.userID;
            let groupID = req.body.groupID;

            let isInGroup = false

            groupArray.groups.map(el =>{
                if(el.groupID == groupID){
                    el.userID(userIDInGroup =>{
                        //checking to see if the user is already apart of the group
                        if(userIDInGroup == userID){
                            isInGroup = true
                        }

                        if(!isInGroup){
                           el.userID.push(userID)
                        }
                        groupsData.push(el)
                    })
                }
            })
            console.log("Data to save: ", groupsData)

            // fs.writeFile("./data/groups.json", JSON.stringify(groupsData), function(err){
            //     if (err) throw err;
            // })
            res.send(true);
        })
    },

    getGroupDetailsByUserID: function(req, res){
        console.log("THIS IS THE REQ DATA FROM THE GROUP API CALL: ", req.body)
        fs.readFile("./data/groups.json", 'utf8', function(err, data){
            if (err) throw err;
            console.log("THIS IS THE data DATA FROM THE GROUP API CALL: ", data)

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
            console.log("req.body",req.body)
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
            console.log("req.body",req.body)
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
    }
};