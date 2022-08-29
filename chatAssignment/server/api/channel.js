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
    }
};