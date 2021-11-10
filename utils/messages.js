const moment=require("moment")
function formatMessage(username,text){
  const date=new Date();
  return{
    username,
    text,
    time:moment(date.toISOString()).format("DD MMM YYYY h:mm a")
  }
}
module.exports=formatMessage
