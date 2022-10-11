module.exports = {
    getChannel: function(db, app){
        app.get('/getChannel', function(req, res){
            const collection = db.collection('channels');

            collection.find({}).toArray((err, data) => {
                if (err) throw err;

                res.send(data);
                if(data == []){
                    res.sendStatus(200)
                }
            })
        })
    },
    
    createChannel: function(db, app){
        app.post('/createChannel', function(req, res){
            const collection = db.collection('channels');
            let channel = req.body;
            let validChannel = true;

            collection.find().sort({id: -1}).toArray((err, data) => {
                if (err) throw err;

                channel.id = data[0].id + 1;
                // Check if the there is a channel with that channel name.
                data.map(el => {
                    if(el.name == channel.name){
                        validChannel = false;
                    }
                })

                if(validChannel){
                    collection.insertOne(channel, (err) => {
                        if (err) throw err;
                        console.log("TEST TEST ")
                        res.sendStatus(200)
                    })
                }
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

            collection.find({id: parseInt(channelID)}).toArray((err, data) => {
                let newUserArray = []

                data[0].userID.map(el => {
                    if(el != userID){
                        newUserArray.push(el)
                    }
                })                  

                collection.updateOne({id: parseInt(channelID)}, {$set: {userID: newUserArray}})
                res.sendStatus(200);
            })

        })
    },
    getChannelByChannelName: function(db, app){
        app.post('/getChannelByChannelName', function(req, res){
            const collection = db.collection('channels');
            let channelName = req.body.channelName;

            collection.find({'name': channelName}).toArray((err, data) => {
                res.send(data[0]);
            })
        })
    },
    


    getChannelsByUserID: function(db, app){
        app.post('/getChannelsByUserID', function(req, res){
            const collection = db.collection('channels');
            let userID = req.body.userID
            let groupID = req.body.groupID


            collection.find({'groupID': groupID}).toArray((err, data) => {
                let channels = [];
                data.map(el =>{
                    el.userID.map(userIDElement => {
                        if(userIDElement == userID){
                            channels.push(el)
                        }
                    })
                })

                res.send(channels);
            })
        })
    },

    getChannelsByGroupID: function(db, app){
        // Get all the groups that the user is a part of
        app.post('/getChannelsByGroupID', function(req, res){
            const collection = db.collection('channels');
            let groupID = req.body.groupID;

            collection.find({'groupID': parseInt(groupID)}).toArray((err, data) => {
                res.send(data)
            })
        })
    },
    
    getChannelHistoryByChannelID: function(db, app){
        app.post('/getChannelHistory', function(req, res){
            const collection = db.collection('chatHistory');
            let channelID = req.body.channelID;

            collection.find({'channelID': parseInt(channelID)}).toArray((err, data) => {
                res.send(data)
            })
        })
    },

    writeChannelHistoryByChannelID: function(db, app){
        app.post('/writeChannelHistory', function(req, res){
            const collection = db.collection('chatHistory');
            let chatMessage = req.body;

            collection.find().sort({id: -1}).toArray((err, data) => {
                let chatMessageID = data[0].id + 1
                let message = {id: chatMessageID, channelID: parseInt(chatMessage.channelID), userID: parseInt(chatMessage.userID),
                                userName: chatMessage.userName, message: chatMessage.message, avatar: chatMessage.avatar,
                                imageURL: chatMessage.imageURL}

                collection.insertOne(message, (err, dbres) => {
                    if (err) throw err;
                    res.sendStatus(200)
                })
            })
        })
    },

    addUserToChannel: function(db, app){
        app.post('/addUserToChannel', function(req, res){
            const collection = db.collection('channels');

            let userID = req.body.userID;
            let channelID = req.body.channelID;

            //TODO: come back later and create code to check for duplicates.
            collection.find({id: parseInt(channelID)}).toArray((err, data) => {
                if (err) throw err
                data[0].userID.push(userID)

                collection.updateOne({id: channelID}, {$set: {userID: data[0].userID}})
                res.sendStatus(200);
            })
        })
    },
};