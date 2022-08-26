var fs = require('fs')

module.exports = {
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
    }
};