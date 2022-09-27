var fs = require('fs');
const user = require('./user');

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
    getChannelByChannelName: function(db, app){
        app.post('/getChannelByChannelName', function(req, res){
            const collection = db.collection('channels');
            let channelName = req.body.channelName
            console.log("TESt")

            collection.find({'name': channelName}).toArray((err, data) => {
                console.log("getChannelByChannelName: ", data)
                res.send(data[0]);
            })
        })
    },
    


    getChannelsByUserID: function(db, app){
        app.post('/getChannelsByUserID', function(req, res){
            const collection = db.collection('channels');
            let userID = req.body.userID
            console.log("TESt")

            collection.find({}).toArray((err, data) => {
                let channels = [];
                console.log("getChannelByChannelName: ", data)
                data.map(el =>{
                    el.userID.map(userIDElement => {
                        if(el.userID == userID){
                            channels.push(el)
                        }
                    })
                })
                console.log("These are the channels from getChannelsByUserID: ",channels)

                res.send(channels);
            })
        })
    },

    getChannelsByGroupID: function(db, app){
        // Get all the groups that the user is a part of
        app.post('/getChannelsByGroupID', function(req, res){
            const collection = db.collection('channels');
            let groupID = req.body.groupID;
            console.log("This is the groupID: ", groupID)

            collection.find({'groupID': parseInt(groupID)}).toArray((err, data) => {
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

    writeChannelHistoryByChannelID: function(db, app){
        app.post('/writeChannelHistory', function(req, res){
            const collection = db.collection('channels');
            let chatMessage = req.body;

            collection.find().sort({id: -1}).toArray((err, data) => {
                let chatMessageID = data[0].id + 1
                let message = {id: chatMessageID, channelID: parseInt(chatMessage.channelID), userID: parseInt(chatMessage.userID),
                                userName: chatMessage.userName, message: chatMessage.message}
                console.log("This is the new message: ", message)

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