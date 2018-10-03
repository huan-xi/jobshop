import config from 'config.js'
var url = config.getDomain+'/vender';
module.exports={
  //上传视频
  uploadVideo:url + "/uploadVideo",
  //登入
  login: config.getDomain  +"/venderlogin",
  //修改信息
  editInfo:url+"/editVender",
  //获取全部工种
  getTypes: config.getDomain + "/public/getTypes",
  //获取信息
  getInfo:url+"/getInfo",
  //发布职位
  publicPosition: url+"/publicPosition",
  //获取全部职位信息
  getPositions:function(page,size){
    return url + `/getPositions?page=${page}&size=${size}`
  }
}