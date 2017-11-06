var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var http = require('http');

server.listen(8080, ip, function(){
	console.log("Server is running... ");
});
//}).listen(8080, "0.0.0.0");

io.on('connection', function(socket){
	console.log("Player Connected! id: " + socket.id);
	socket.emit('socketID', { id: socket.id });
	socket.emit('getPlayers', players);
	socket.broadcast.emit('newPlayer', { id: socket.id});
    socket.on('playerMoved', function(data){
        data.id = socket.id;
        socket.broadcast.emit('playerMoved', data);

        //console.log("player moved: " + "ID: " + data.id + "X: " + data.x + "Y: " + data.y)

        for(var i=0; i<players.length; i++){
            if(players[i].id == data.id){
                players[i].x = data.x;
                players[i].y = data.y;
            }
        }
    });
	socket.on('disconnect', function(){
		console.log("Player Disconnected!");
        socket.broadcast.emit("playerDisconnected", { id: socket.id});
		for(var i=0; i < players.length; i++){
		    if(players[i].id == socket.id){
		        players.splice(i, 1);
		    }
		}
	});
	players.push(new player(socket.id, 0,0))
});
	

function player(id, x, y){
    this.id = id;
    this.x = x;
    this.y = y;
}