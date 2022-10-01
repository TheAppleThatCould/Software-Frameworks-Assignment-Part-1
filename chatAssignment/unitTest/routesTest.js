var assert = require('assert'); //link in assertion library
var http = require("http");


describe("Server test", function() {
    before(function() {console.log("Test stuff before the test")});

    describe("route/something", function() {
        it("What should the rout do, return all groups maybe? ", function() {
            http.get("http://localhost:3000/ROUTEURL", function(res){
                assert.equal(res.statusCode, 200);

                
            })
        })
    });

});
