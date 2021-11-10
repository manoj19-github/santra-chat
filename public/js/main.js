const chatForm=document.getElementById("chat-form");
const chatMessages=document.querySelector(".chat-messages");
const leaveBtn=document.querySelector("#leave-btn");
const roomName=document.getElementById("roomName");
const userList=document.getElementById("usersList");

function outputRoomName(room){
  roomName.innerText=room;
}
// Add users to dom
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join(" ")}`;
}
leaveBtn.addEventListener("click",(event)=>{
  event.preventDefault();
  window.close();
})


// Get user name and room from url
const {username,room}=Qs.parse(location.search,
  {
    ignoreQueryPrefix:true
  }
)
const socket=io();
//  Join Chat room

socket.emit("joinRoom",{username,room})

// get room and user
socket.on("roomUser",({room,users})=>{
  outputRoomName(room)
  outputUsers(users)
})
// Message submit
socket.on('message',message=>{
  console.log('message : ',message);
  outputMessage(message,username);
  //scroll down
  chatMessages.scrollTop=chatMessages.scrollHeight;
})

// Message Submit
chatForm.addEventListener("submit",(event)=>{
  event.preventDefault();
  const msg=event.target.elements.msg.value;
  //  EMIT MESSAGE TO SERVER
  socket.emit("chatMessage",msg);

  // clear input
  event.target.elements.msg.value="";
  event.target.elements.msg.focus();


})

function outputMessage(message,username){
  const div=document.createElement("div");
  if(message.username===username){
    div.classList.add("message");
    div.classList.add("send-message");
  }else{
    div.classList.add("message");
  }


  div.innerHTML=`<p class="meta" >
    <span style="margin-right:1rem">
      ${message.username!==username?message.username:`You`}
    </span>
    <span>
      ${message.time}
    </span>
  </p>
  <p class="text">
   ${message.text}
  </p>
  `;
  document.querySelector(".chat-messages")
  .appendChild(div);
}
// output room name
