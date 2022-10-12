var assert = require('assert'); //link in assertion library
let app = require("../server.js");
let chai = require('chai');
let chaiHttp = require("chai-http")
let should = chai.should();
chai.use(chaiHttp);


// setup for sockets
var io = require("socket.io-client");
var socketURL = "http://localhost:3000";
var options = {
    transports: ["websocket"],
    "force new connection": true
}


// testing the socket connection
describe("Route testing for auth routes", ()=> {
    describe('Login api route', () => { // testing for the login api route
        it('Login to super user account and should return the super user data', (done) => {
            let userDetail = {userName: "super", password: "super"}
            chai.request(app).post("/login").type("form").send(userDetail)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.have.property("userName");
                    res.body.should.have.property("id");
                    done();
                })
        });
    });
})


// All the testing for the routes.
describe('Route testing for user routes', () => { // testing all the functions in the api/auth.js.
    let testUser = {userName: "test", email: "test", birthDate: "test", age: 0, password: "test", 
                    role: "test", id: 0, valid: false, imageURL: "test"}; // test user


    // Get all the users
    describe('Users api getAllUsers ', () => {
        it('Should get all users', (done) => {
            chai.request(app).get("/getAllUsers").end((err, res) => {
                res.should.have.status(200);
                done();
            })
        });
    });

    // Create a user
    describe("User api createUser", () => {
        it("Create a test user ", (done) => {
            //create user and make sure the user was created
            
            chai.request(app).post("/createUser").type("form").send(testUser)
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
            });
        });
    });

    // Get user by userName
    describe('Users api getUserByUserName', () => {
        it('Get super user', (done) => {
            chai.request(app).post("/getUserByUserName").type("form").send({userName: "super"})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
        });
    });


    // Creating a user, updating it, then checking the value for the updated user.
    describe('Users api updateUser', () => {
        it('update test user to have valid = false', (done) => {
            let testUser = {userName: "test", email: "test", birthDate: "test", age: 0, password: "test", role: "test", id: 0, valid: false, imageURL: "test"};

            chai.request(app).post("/updateUser").type("form").send(testUser)
                .end((err, res) =>{
                    res.should.have.status(200);
                })

            chai.request(app).post("/getUserByUserName").type("form").send({userName: "test"})
            .end((err, res) =>{
                res.should.have.status(200);
                assert.equal(res.body.valid, 'false');
                done();
            })
        });
    });


    // Creating a user, updating it, then checking the value for the updated user.
    describe('Users api updateUserAvatar', () => {
        it('update test user avatar to have test.jpg string', (done) => {
            const userID = 0;
            const imagePath = "test.jpg";

            chai.request(app).post("/updateUserAvatar").type("form").send({userID: userID, imagePath: imagePath})
                .end((err, res) =>{
                    res.should.have.status(200);
                })

            chai.request(app).post("/getUserByUserName").type("form").send({userName: "test"})
            .end((err, res) =>{
                res.should.have.status(200);
                assert.equal(res.body.imageURL, "test.jpg");
                done();
            })
        });
    });

    // Delete the test user
    describe('Users api deleteUser', () => { // testing for the deleteUser api route
        it('delete test user', (done) => {
            // Delete the test user.
            chai.request(app).post("/deleteUser").type("form").send({userID: 3})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
        });
    });
});



// Test the socket connection
describe("Chat server", ()=> {
    it("Should broadcast message to all users", (done)=>{
        var client1 = io.connect(socketURL, options);
        client1.on("connect", ()=>{
            client1.emit("message", 'Client one message');

            var client2 = io.connect(socketURL, options);
            client2.on("connect", (data)=>{
                client2.emit("message", "Client two message")
            });

            client1.on("message", (data)=> {
                assert.equal(data, "Client one message");
                client1.disconnect();
            });

            client2.on('message', (data)=>{
                assert.equal(data, "Client two message");
                client2.disconnect();
                done();
            })
        })
    })
})


// testing the channel routes
describe("Route testing for channel routes", ()=> {
        let newChannel = {id: 0, name: "test", groupID: 0, userID: [0]};

        // Get all channels ->
        describe('channel api getChannel', () => { // testing for the deleteUser api route
            it('get all channel and check the results', (done) => {
                chai.request(app).get("/getChannel").type("form").end((err, res) =>{
                    data = res.body;
                    res.should.have.status(200);
                    data.should.have.lengthOf.above(1);
                    done();
                })
            });
        });


        // Create a channel and test it by getting the channel by its userName ->
        describe('channel api createChannel', () => { // testing for the deleteUser api route
            it('Create channel and check the response status', (done) => {

                chai.request(app).post("/createChannel").type("form").send(newChannel)
                .end((err, res) =>{
                    res.should.have.status(200);

                    // Get the new channel
                    chai.request(app).post("/getChannelByChannelName").type("form").send({channelName: newChannel.name})
                    .end((err, res) =>{
                        res.should.have.status(200);
                        res.body.should.have.property("name");
                        done();
                    })
                })
            });
        });

        // Add user to a channel.
        describe('channel api addUserToChannel', () => { // testing for the deleteUser api route
            it('Add a user to a channel', (done) => {
                // The new channel will recieve a new channelID by incremented the last channel id by one.

                chai.request(app).post("/addUserToChannel").type("form").send({channelID: 19, userID: 0})
                .end((err, res) =>{
                    res.should.have.status(200);

                    chai.request(app).post("/getChannelByChannelName").type("form").send({channelName: newChannel.name})
                    .end((err, res) =>{
                        res.should.have.status(200);
                        
                    
                        let userIsApart = false;
                        // Set UserIsApart to true if test channel has the added user in it.
                        res.body.userID.map(el => {
                            if(el == 0){
                                userIsApart = true;
                            }
                        })

                        res.body.should.have.property("name");
                        done();
                    })
                })
            });
        });

        // Remove a user from the test channel
        describe('channel api removeUserFromChannel', () => { // testing for the deleteUser api route
            it('Remove the a user from a channel', (done) => {
                // The new channel will recieve a new channelID by incremented the last channel id by one.

                chai.request(app).post("/removeUserFromChannel").type("form").send({channelID: 19, userID: 0})
                .end((err, res) =>{
                    res.should.have.status(200);
                })

                chai.request(app).post("/getChannelByChannelName").type("form").send(newChannel.name)
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });


        // Get channel by its name
        describe('channel api getChannelByChannelName', () => { // testing for the deleteUser api route
            it('Get test channel with the channel name "test "', (done) => {

                chai.request(app).post("/getChannelByChannelName").type("form").send({channelName: "test"})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });

        // Get channel by user's id
        describe('channel api getChannelsByUserID', () => { // testing for the deleteUser api route
            it('Get channel by user id', (done) => {
                chai.request(app).post("/getChannelsByUserID").type("form").send({userID: 0}) // user id 0 is test
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });

        // Get channel by group's id
        describe('channel api getChannelsByGroupID', () => { // testing for the deleteUser api route
            it('Get channel by group id', (done) => {


                chai.request(app).post("/getChannelsByGroupID").type("form").send({groupID: 0})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });

        // Get channel history by the channel's id
        describe('channel api getChannelHistory', () => { // testing for the deleteUser api route
            it('Get channel history by channel id', (done) => {
                chai.request(app).post("/getChannelHistory").send({channelID: 1})
                .end((err, res) =>{
                    res.should.have.status(200);
                    // data.should.have.lengthOf.above(1);
                    done();
                })
            });
        });


        // Write the channel history by the channel's id
        describe('channel api writeChannelHistory', () => { // testing for the deleteUser api route
            it('Write channel history by channel id', (done) => {
                let message = {id: 0, channelID: 1, userID: 0,
                    userName: "test", message: "test message", avatar: "test.png",
                    imageURL: "test.png"}

                chai.request(app).post("/writeChannelHistory").type("form").send(message)
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });


        // Delete the previously created channel
        describe('channel api deleteChannel', () => { // testing for the deleteUser api route
            it('Delete the channel that was just created', (done) => {
                let newChannel = {id: 0, name: "test", groupID: 0, userID: [0]};
                // The new channel will recieve a new channelID by incremented the last channel id by one.

                chai.request(app).post("/deleteChannel").type("form").send({channelID: 19})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            });
        });
})



// testing the group routes
describe("Route testing for group routes", ()=> {
    let groupData = {id: 0, name: 'test', userID: [0], adminID: 0, assistantID: [0]}; // group data for testing

    // Get all groups
    describe('group api getGroups', () => {
        it('get all groups and check the results', (done) => {
            chai.request(app).get("/getGroups").type("form").end((err, res) =>{
                res.should.have.status(200);
                res.body[0].should.have.property("name");
                done();
            })
        });
    });

    // Create group
    describe('group api createGroup', () => {
        it('Create a group', (done) => {
            chai.request(app).post("/createGroup").send(groupData)
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

    // Add a user to a group that was previously created
    describe('group api addUserToGroup', () => {
        it('Add a user to a group', (done) => {
            chai.request(app).post("/addUserToGroup").type("form").send({userID: 0, groupID: 1}) 
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

    // get group by user id
    describe('group api getGroupsByUserID', () => {
        it('Get group by user id', (done) => {

            // group id 10 would be the newly created group
            chai.request(app).post("/getGroupsByUserID").type("form").send({groupID: 10}) 
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

     // Get group by group name
     describe('group api getGroupsByGroupName', () => {
        it('get group by group name', (done) => {
            chai.request(app).post("/getGroupsByGroupName").type("form").send(groupData.name)
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

    // Get group by group id
    describe('group api getGroupsByGroupID', () => {
        it('get group by group ID', (done) => {
            chai.request(app).post("/getGroupsByGroupID").type("form").send({groupID: 10})
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

    // update group admin
    describe('group api updateGroupAdmin', () => {
        it('Update group admin', (done) => {
            chai.request(app).post("/updateGroupAdmin").type("form").send({groupID: 10, userID: 0})
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

    // update group assistant
    describe('group api updateGroupAssistant', () => {
        it('Update group assistant', (done) => {
            chai.request(app).post("/updateGroupAssistant").type("form").send({groupID: 10, userID: 0})
            .end((err, res) =>{
                res.should.have.status(200);
                done();
            })
        });
    });

    // Delete the previously created group
    describe('group api deleteChannel', () => { // testing for the deleteGroup api route
        it('Delete the group that was just created', (done) => {
            let groupID;
            chai.request(app).post("/getGroupsByGroupName").type("form").send({groupName: "test"})
            .end((err, res) =>{
                groupID = res.body.id;

                chai.request(app).post("/deleteGroup").type("form").send({channelID: groupID})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
            })
        });
    });
})
