var fs = require('fs')

module.exports = {
    getChannelByGroupID: function(req, res){
        fs.readFile("./data/channels.json", 'utf8', function(err, data){
            if (err) throw err;
            console.log("THIS IS THE data DATA FROM THE GROUP API CALL: ", data)

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
            console.log("THIS IS THE data DATA FROM THE getChannelHistoryByChannelID API CALL: ", data)

            let channelArray = JSON.parse(data);
            let channelsHistoryData = [];
            let channelID = req.body.channelID;
            
            channelArray.chatHistory.map((el) => {
                if(el.channelID == channelID){
                    channelsHistoryData.push(el);
                }
            })

            res.send(channelsHistoryData);
        })
    }
};