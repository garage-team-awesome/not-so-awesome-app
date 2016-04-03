var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var googleTranslate = require('google-translate')('AIzaSyDtE3oif_9mIi20aU8Fva2QLgMJcuiNwa0');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg, lang, user){
    socket.broadcast.emit('get lang', lang, msg);
    socket.emit("show message", msg);
  });
  socket.on('translate msg', function(src_lang, dst_lang, msg) {
    if(src_lang == dst_lang) {
        socket.emit('show message', msg);
    } else {
      googleTranslate.translate(msg, src_lang, dst_lang, function(err, res) {
        if(res) {
          socket.emit('show message', res["translatedText"]);
        } else {
          socket.emit('show message', msg);
        }
      });
    }
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});
