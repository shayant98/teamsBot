const moment = require("moment")


exports.parseDate = (date) => {
    dateData = date.split("/");
    const day = dateData[0]
    const month = Number(dateData[1]) - 1
    const year = dateData[2]
    
    return [Number(day), Number(month), Number(year)]
} 

exports.parseTime = (time) => {
    timeData = time.split(":");
    
    return [Number(timeData[0]), Number(timeData[1])]
    
    
}

exports.calculateEndTime = () => {
    now = moment().format();
   endTime = moment().hour(21).minute(15).second(0)

   return endTime.diff(now)
}