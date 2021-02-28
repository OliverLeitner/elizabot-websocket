/**
 * websocket implementation
 * of joseph weizenbaum's eliza
 */
const ElizaBot = require("elizabot");
const WebSocket = require("ws")

var eliza = new ElizaBot();

const server = new WebSocket.Server({
    port: 8020
})

let sockets = []

server.on("connection", function(socket) {
    sockets.push(socket); // lock it in

    socket.on("message", function(msg) {
        // rudimentary logging
        console.log(new Date().toLocaleTimeString() + ": " + msg)

        // channel things to eliza correctly
        if (msg === "init") sockets.forEach(s => s.send(eliza.getInitial()))
        else if (msg === "quit") sockets.forEach(s => s.send(eliza.reset()))
        else sockets.forEach(s => s.send(eliza.transform(msg)))
    });

    socket.on("close", function() {
        eliza.reset() // reset
        sockets = sockets.filter(s => s !== socket)
    });
});