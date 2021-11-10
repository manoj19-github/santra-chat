require("dotenv").config()
const express=require("express")
const path=require("path")
const http=require('http')
const formatMessage=require("./utils/messages")
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
}=require("./utils/users")
const socketIo=require("socket.io")
const app=express()
const server=http.createServer(app)
const io=socketIo(server)





// SET STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')))
const botName="Santra Chat"
// RUN WHEN CLIENT CONNECTS
io.on('connection',(socket)=>{
  socket.on("joinRoom",({username,room})=>{
    const user=userJoin(socket.id,username,room)
    socket.join(user.room)

    console.log(`new web socket connection`)
    // Broadcast when a user connects
    socket.emit('message',formatMessage(botName,"welcome to santra chat"))


    socket.broadcast.to(user.room)
    .emit("message",formatMessage(botName,`${username} has joined the chat`))

    // send  user and group info
    io.to(user.room).emit("roomUser",{
      room:user.room,
      users:getRoomUsers(user.room)
    })


  })


  socket.on("disconnect",()=>{
    const user=userLeave(socket.id)
    if(user){
        io.to(user.room)
        .emit("message",formatMessage(botName,`${user.username} has left the chat`))
        // send  user and group info
        io.to(user.room).emit("roomUser",{
          room:user.room,
          users:getRoomUsers(user.room)
        })
    }

  })
  

  // listen for chatMessage
  socket.on("chatMessage",(msg)=>{
    const user=getCurrentUser(socket.id)

    io.to(user.room).emit("message",formatMessage(user.username,msg))
    console.log("message",msg)
  })
})




// SERVER PORT
const PORT=process.env.PORT || 3000

// SERVER  LISTENING
server.listen(PORT,()=>console.log(`server is running on ${PORT}`))
