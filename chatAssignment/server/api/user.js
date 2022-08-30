var fs = require('fs')

module.exports = {
    getUserByUserName: function(req, res){
        fs.readFile("./data/users.json", 'utf8', function(err, data){
            if (err) throw err;

            let userArray = JSON.parse(data);
            let userData = [];
            let userName = req.body.userName;
            userArray.userDetails.map((el) => {
                if(el.userName == userName){
                    userData.push(el);
                }
            })

            res.send(userData);
        })
    }
};