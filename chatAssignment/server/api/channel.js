var fs = require('fs')

module.exports = {
    getChannel: function(db, app){
        app.get('/getChannel', function(req, res){
            const collection = db.collection('channels');

            collection.find({}).toArray((err, data) => {
                console.log("getChannel: ", data)
                res.send(data);
            })
        })
    },
    
    createChannel: function(db, app){
        app.post('/createChannel', function(req, res){
            const collection = db.collection('channels');
            let channel = req.body
            console.log("This is the channel: ", channel)

            collection.find().sort({id: -1}).toArray((err, data) => {
                channel.id = data[0].id + 1

                collection.insertOne(channel, (err, dbres) => {
                    if (err) throw err;
                    res.sendStatus(200)
                })
            })
        })
    },

    deleteChannel: function(db, app){
        app.post('/deleteChannel', function(req, res){
            const collection = db.collection('channels');
            let channelID = req.body.channelID;
            
            collection.deleteOne({id: parseInt(channelID)});
            res.sendStatus(200);
        })
    },

    removeUserFromChannel: 
    function(db, app){
        //TODO: check to see if its working
        app.post('/removeUserFromChannel', function(req, res){
            const collection = db.collection('channels');
            let channelID = req.body.channelID;
            let userID = req.body.userID;
            
            console.log(channelID)

            collection.find({id: parseInt(channelID)}).toArray((err, data) => {
                console.log("data: ", data)
                let newUserArray = []

                data[0].userID.map(el => {
                    if(el != userID){
                        newUserArray.push(el)
                    }
                })
                console.log(newUserArray)                    

                collection.updateOne({id: parseInt(channelID)}, {$set: {userID: newUserArray}})
                res.sendStatus(200);
            })

        })
    },
    
    // function(req, res){
    //     fs.readFile("./data/channels.json", 'utf8', function(err, data){
    //         if (err) throw err;
    //         let channelArray = JSON.parse(data);
    //         let channelsData = [];
    //         let userID = req.body.userID;
    //         let channelID = req.body.channelID;

    //         channelArray.channels.map(el =>{
    //             if(el.channelID == channelID){
    //                 el.userID.map((userIDInChannel, index) => {
    //                     if(userIDInChannel == userID){
    //                         el.userID.splice(index,1)
    //                     } 
    //                 })
    //             }
    //             channelsData.push(el)
    //         })

    //         fs.writeFile("./data/channels.json", JSON.stringify({channels: channelsData}), function(err){
    //             if (err) throw err;
    //             else {
    //                 res.send(true);
    //             }
    //         })
    //     })
    // },


    getChannelByChannelName: function(db, app){
        // TODO: need to fix this
        app.post('/getChannelByChannelName', function(req, res){
            const collection = db.collection('channels');
            let channelName = req.body.channelName
            console.log("TESt")

            collection.find({'name': channelName}).toArray((err, data) => {
                console.log("getChannelByChannelName: ", data)
                res.send(data);
            })
        })
    },
    


    getChannelByUserID: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;

            let channelArray = JSON.parse(data);
            let channelsData = [];
            let groupID = req.body.groupID;
            let userID = req.body.userID;
            
            channelArray.channels.map((el) => {
                if(el.groupID == groupID){
                    el.userID.map(channelUserID => {
                        if(channelUserID == userID){
                            channelsData.push(el);
                        }
                    })
                }
            })
            res.send(channelsData);
        })
    },
    getChannelsByGroupID: function(db, app){
        // Get all the groups that the user is a part of
        app.post('/getChannelsByGroupID', function(req, res){
            const collection = db.collection('channels');
            let groupID = req.body.groupID;
            console.log("This is the groupID: ", groupID)

            collection.find({id: parseInt(groupID)}).toArray((err, data) => {
                console.log(data)
                res.send(data)
            })
            
    
        })
    },

    
    getChannelHistoryByChannelID: function(req, res){
        fs.readFile("./data/chatHistory.json", 'utf8', function(err, data){
            if (err) throw err;
            let channelArray = JSON.parse(data);
            let channelsHistoryData = [];
            let channelID = req.body.channelID;
            
            channelArray.map((el) => {
                if(el.channelID == channelID){
                    channelsHistoryData.push(el);
                }
            })

            res.send(channelsHistoryData);
        })
    },

    writeChannelHistoryByChannelID: function(req, res){
        fs.readFile("./data/chatHistory.json", function(err, data){
            let chatHistoryArray = JSON.parse(data);
            chatHistoryArray.push(req.body)

            fs.writeFile("./data/chatHistory.json", JSON.stringify(chatHistoryArray), function(err){
                if (err) throw err;
            })
        })

        res.send(true)
    },


    addUserToChannel: function(req, res){
        fs.readFile("./data/channels.json", function(err, data){
            let channelArray = JSON.parse(data);
            let channelData = [];
            let isUserInChannel = false;
            let valid = true;

            channelArray.channels.map(el => {
                if(el.channelID == req.body.channelID){
                    el.userID.map(userID=>{
                        if(userID == req.body.userID){
                            isUserInChannel = true
                        }
                    })

                    if(!isUserInChannel){
                        el.userID.push(req.body.userID)
                    }
                }
                channelData.push(el)
            })

            fs.writeFile("./data/channels.json", JSON.stringify({channels: channelData}), function(err){
                if (err) throw err;
                else {
                    res.send(true)
                }
            })
        })
    },
};