const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}

const formatTimeAdd = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()+1
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
const formatCountDown = date => {
  date = Math.ceil(date/1000)
  const hour = parseInt(date / 3600) 
  date = date % 3600;
  const minute = parseInt(date / 60);
  const second = date % 60;
  return `${hour}时${minute}分${second}秒`
}
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatTimeAdd: formatTimeAdd,
  formatCountDown: formatCountDown
}
