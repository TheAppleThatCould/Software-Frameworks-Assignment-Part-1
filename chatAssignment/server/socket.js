module.exports = {
    // A fuction that will start a socket connection
    connect: function(io, PORT){
        io.on("connection", (socket) => {
            console.log("user connection on port " + PORT + " : " + socket.id);

            socket.on("message", (message)=>{
                io.emit("message", message);
            })
        })
    }
}


