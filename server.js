var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var usersConnected = 0;

//change for sakak
app.use(express.static('public'));

http.listen(3000, function(){
	console.log('listening on *:3000');
});

app.get('/', function(req, res){
	res.sendFile(__dirname +'/public/views/index.html');
});

io.on('connection', function(socket){

	console.log(++usersConnected);
	io.sockets.emit('connected users',usersConnected);

	socket.on('disconnect', function(){
		console.log(--usersConnected);
		socket.broadcast.emit('connected users',usersConnected);
	});

	socket.on('chat message', function(userName,msg){
		socket.broadcast.emit('chat message', filterCommends(userName,msg));
	});
});

function filterCommends(userName,msg) {
	var letters = msg.split(' ');
	Array.prototype.slice.call(letters);
	var messageBudy = '<div class="message" style = "';
	messageBudy;

	for(var i= 0 ;i<letters.length;i++){
		if(letters[i].charAt(0)=='/')
		{
			if(letters[i].includes('color'))
			{
             	messageBudy = setStyle('color',letters[i+1],messageBudy);
				letters.splice(i,2);
				i-=2;
			}
			else if(letters[i].includes('border'))
			{
				messageBudy = setStyle('border','1px solid',messageBudy);
				letters.splice(i,1);
				i--;
			}
			else if(letters[i].includes('italic'))
			{
				messageBudy = setStyle('font-style','italic',messageBudy);
				letters.splice(i,1);
				i--;
			}
			else if(letters[i].includes('bold'))
			{
				messageBudy = setStyle('font-weight','bold',messageBudy);
				letters.splice(i,1);
				i--;
			}

		}

	}
	messageBudy+= '">';
	messageBudy+= "<span style='color: gray'>"+userName+" : </span>";
	letters.forEach(function (t) { messageBudy+= t+' ' });
	messageBudy+='</div>';
   return messageBudy;
}
//i am red /color red /color blue just kidding im blue /border whatsappp
function setStyle(type,commend,messageBudy){
		messageBudy+=type+':'+ commend+';';
	return messageBudy;
}