var fs = require('fs')

module.exports = function(req, res){
    let arrayOfUsers = []
    fs.readFile("./data/users.json", 'utf8', function(err, data){
        if (err) throw err;
        let userArray = JSON.parse(data)
        arrayOfUsers = userArray.userDetails;
    
        let userName = req.body.userName; 
        let password = req.body.password;
        let userDetails = {valid: false};
    
        if(arrayOfUsers.length > 0){
            arrayOfUsers.map(el => {
                if(el.userName == userName || el.email == userName && el.password == password){
                    userDetails = el;
                    userDetails.valid = true;
                }
            })
        }
        res.send(userDetails);
    })
};
