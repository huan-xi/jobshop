import config from 'config.js'
var url = config.getDomain+'/vender';
module.exports={
  //图片地址
  getImageSrc: function () {
    return config.getImageHost
  },
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
  getPositions:function(page,size,type){
    return url + `/getPositions?page=${page}&size=${size}&type=${type}`
  },
  //获取职位详情
   getPosition: function (id) {
    return config.getDomain + `/public/getPosition?id=${id}`
  },
  //修改职位信息
  editPosition: url +"/editPosition",
  //获取订单
  getOrders: function (page, size, type){
    return url + `/getOrders?page=${page}&size=${size}&type=${type}`
  },
  //取消叮当
  cancelOrder:function(orderId){
    return url + `/cancelOrder?orderId=${orderId}`;
  },
  //删除职位信息
  deletePosition:function(id){
    return url +`/deletePosition?positionId=${id}`
  },
  //删除订单
  deleteOrder:function(id){
    return url +`/deleteOrder?orderId=${id}`
  },
  //完成订单
  finishOrder:function(id){
    return url + `/finishOrder?orderId=${id}`
  },
  //提交反馈信息
  feedback: config.getDomain +"/public/feedback",
  //获取客服信息
  getServiceInfo: config.getDomain + "/public/getServiceInfo",
  //get notice
  getNotice: config.getDomain +"/public/getVenderNotice",
  //获取时间
  getTime: config.getDomain + "/public/getTime"
}