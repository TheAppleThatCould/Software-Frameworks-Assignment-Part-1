var fs = require('fs')

module.exports = {
    getChannel: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;
            let channelArray = JSON.parse(data);
            res.send(channelArray)
        })
    },
    deleteChannel: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;
            let channelArray = JSON.parse(data);
            let channelsData = [];
            let channelID = req.body.channelID;

            channelArray.channels.map(el =>{
                if(el.channelID != channelID){
                    channelsData.push(el)
                }
            })
            console.log("deleteChannel function -> New channelsData: ", channelsData)
            fs.writeFile("./data/channels.json", JSON.stringify({channels: channelsData}), function(err){
                if (err) throw err;
                else {
                    res.send(true);
                }
            })
        })
    },
    removeUserFromChannel: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;
            let channelArray = JSON.parse(data);
            let channelsData = [];
            let userID = req.body.userID;
            let channelID = req.body.channelID;

            channelArray.channels.map(el =>{
                if(el.channelID == channelID){
                    el.userID.map((userIDInChannel, index) => {
                        if(userIDInChannel == userID){
                            el.userID.splice(index,1)
                        } 
                    })
                }
                channelsData.push(el)
            })

            console.log("removeUserFromChannel function -> New channelsData: ", channelsData)

            fs.writeFile("./data/channels.json", JSON.stringify({channels: channelsData}), function(err){
                if (err) throw err;
                else {
                    res.send(true);
                }
            })
        })
    },
    getChannelByChannelName: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;
            console.log("THIS IS THE data DATA FROM THE GROUP API CALL: ", data)
            console.log("THIS IS THE data DATA FROM THE GROUP API CALL: ", req.body)

            let channelArray = JSON.parse(data);
            let channelsData = {};
            let channelName = req.body.channelName;
            
            channelArray.channels.map((el) => {
                if(el.name == channelName){
                    channelsData = el;
                }
            })

            res.send(channelsData);
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
    getChannelByGroupID: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;

            let channelArray = JSON.parse(data);
            let channelsData = [];
            let groupID = req.body.groupID;
            
            channelArray.channels.map((el) => {
                if(el.groupID == groupID){
                    channelsData.push(el);
                }
            })

            res.send(channelsData);
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
            console.log("data for write chat history channelArray: ", channelsHistoryData)

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

        res.send({valid: false})
    },

    createChannel: function(req, res){
        fs.readFile("./data/channels.json", function(err, data){
            let channelArray = JSON.parse(data);
            let channelsData = [];
            let valid = true;

            channelArray.channels.map(el => {
                channelsData.push(el);

                if(el.channelID == req.body.channelID){
                    valid = false
                }
            })
            channelsData.push(req.body)
            console.log("valid channel: ", valid)


            if(valid){
                fs.writeFile("./data/channels.json", JSON.stringify({channels: channelsData}), function(err){
                    if (err) throw err;
                })
                res.send(true)
            } else {
                res.send(false)
            }
        })
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

            console.log("channelData for new user to channel",channelData)

            fs.writeFile("./data/channels.json", JSON.stringify({channels: channelData}), function(err){
                if (err) throw err;
                else {
                    res.send(true)
                }
            })
        })
    },
    // removeUserFromChannel: function(req, res){
    //     fs.readFile("./data/channels.json", function(err, data){
 
    //     })
    // }
};