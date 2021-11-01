//module.exports is a JS object and here we have made a getDate method and assigned it getDate function
module.exports.getDate=getDate;

function getDate()
{
  var date=new Date(); //gets date in form of a JS object
  var currDay=date.getDay();//gets day of the week today
  var dayType;

//tells what all we want in our date string
var option={
  weekday:"long",
  day:"numeric",
  month:"long",
  year:"numeric"
};

//converts the date object we get from new date() function to a string
var dayType=date.toLocaleDateString("en-IN",option);

return dayType;
}

module.exports.getDay=getDay;
function getDay()
{
  var date=new Date(); //gets date in form of a JS object
  var currDay=date.getDay();//gets day of the week today
  var dayType;

//tells what all we want in our date string
var option={
  weekday:"long",

};

//converts the date object we get from new date() function to a string
var dayType=date.toLocaleDateString("en-IN",option);

return dayType;
}
