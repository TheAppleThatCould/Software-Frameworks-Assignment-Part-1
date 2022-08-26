var fs = require('fs')

module.exports = {
    getGroupDetailsByUserID: function(req, res){
        fs.readFile("./data/group.json", 'utf8', function(err, data){
            if (err) throw err;
            let userID = req.body.userID;
            let groupArray = JSON.parse(data)
            let groupsData = [];
            
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






