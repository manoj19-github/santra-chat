const moment=require("moment-timezone")
function formatMessage(username,text){

  const date = moment.tz(new Date(),"Asia/Kolkata");
  return{
    username,
    text,
    time:date.format("DD MMM YYYY h:mm a")
  }
}
module.exports=formatMessage
