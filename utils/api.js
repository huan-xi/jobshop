import config from 'config.js'
var url = config.getDomain;
module.exports={
  //修改信息
  editInfo: url + "/shop/info",
  //图片地址
  getImageSrc: function () {
    return config.getImageHost
  },
  //获取token
  login: config.getDomain +"/token/shop",
  //工作添加图片
  addImage: config.getDomain+"/shop/job/image",
  //获取信息
  getInfo:url+"/shop/info",
  //发布职位
  publicPosition: url +"/shop/job",
  //获取全部职位信息
  getPositions:function(page,size,status){
    return url + `/shop/jobs/${status}?page=${page}&size=${size}`
  },
  //获取职位详情
  getJob: function (id) {
    return config.getDomain + `/shop/job/${id}`
  },
  republic:function(id){
    return config.getDomain + `/shop/job/republic/${id}`
  },
  //获取客服信息
  getPhone: config.getDomain + "/value/KF_PHONE",
  //删除职位图片
  deleteImage(id){
    return url +`/shop/job/image/delete/${id}`
  },
  //修改职位信息
  uodateJob: url +"/shop/job/update",
  //删除职位信息
  deletePosition:function(id){
    return url +`/shop/job/delete/${id}`
  },
  //永久删除
  destroyJob:function(id){
    return url + `/shop/job/destroy/${id}`
  },
  //提交反馈信息
  feedback: config.getDomain +"/public/feedback",
  //获取客服信息
  getServiceInfo: config.getDomain + "/public/getServiceInfo",
  //get notice
  getNotice: config.getDomain +"/value/NOTICE_SHOP",
  uptoken: config.getDomain + "/token/upload"
}