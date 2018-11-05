/**
 * Created by 10560 on 2018/11/5.
 */
const Messages=require('../models/messages');
module.exports=function (server) {
  const io=require('socket.io')(server);
  io.on('connection',function (socket) {
    console.log('socketio connected');
    socket.on('sendMsg',async function (data) {
      console.log('浏览器发来的消息',data);
      const chat_id=[data.from,data.to].sort().join('-');
      console.log(chat_id);
      const result=await Messages.create({from:data.from,to:data.to,content:data.content, chat_id, create_time: Date.now()})
      io.emit('receiveMsg',{from:result.from,to:result.to,content:result.content,chat_id:result.chat_id,create_time:result.create_time,read:result.read})
      console.log('服务器发来的消息',result);
    })
  })
}