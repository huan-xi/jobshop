const api = require('../../utils/api.js');
const wxRequest = require('../../utils/wxRequest.js')
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');
const qiniuUploader = require("../../utils/qiniuUploader")
let id;
Page({
  data: {
    desc: '',
    images: [],
  },
  refresh() {
    wxRequest.get(api.getJob(id), e => {
      let images = e.msg.images
      this.setData({
        images,
        desc: e.msg.job_desc
      });
    })
  },
  onLoad: function (option) {
    id = option.id
    this.refresh()
  },
  //选择图片
  choosePic: function () {
    var that = this
    wx.chooseImage({
      success: function (res) {
        //上传 修改
        that.uploadFile(res.tempFilePaths[0]);
      },
    })
  },
  deletePic(e) {
    let index = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定要删除该张图片吗',
      success: res => {
        wxRequest.get(api.deleteImage(index), e => {
          if (e.status == 1) {
            wx.showToast({
              title: e.msg,
            })
            this.refresh()
          }
        });
      }
    })
  },
  descInputChange: function (e) {
    var desc = e.detail.value
    this.setData({
      desc: desc
    })
  },
  //上传文件
  uploadFile(src) {
    wx.showLoading({
      title: '正在上传图片'
    })
    //上传图片到七牛云
    qiniuUploader.upload(src, res => {
      wxRequest.post(api.addImage, {
        job_id: id,
        src: res.imageURL
      }, e => {
        if (e.status == 1) {
          wx.showToast({
            title: '上传图片成功',
          })
          this.refresh()
        }
      });
    }, (error) => {
      wx.hideLoading()
      throw new Error("上传图片失败");
      console.log('error: ' + error);
    }, {
        region: 'SCN', // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
        uptokenURL: api.uptoken,
      })
  },
  //提交信息
  submit: function () {
    var that = this
    wx.showLoading({
      title: '正在修改工作信息',
    })
    wxRequest.post(api.uodateJob, {
      job_id:id,
      job_desc: that.data.desc,
    }, function (e) {
      wx.hideLoading()
      if (e.status == 1) {
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          success: e => {
            if (e.confirm) {
              wx.switchTab({
                url: '/pages/position/position',
              })
            }
            //写有修改
            wx.setStorageSync("jobChange", true)
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: e.msg,
          showCancel: false
        })
      }
    })
  },
  //错误提示
  tip: function (isNot, content) {
    if (isNot) {
      wx.showModal({
        title: '提示',
        content: content,
        showCancel: false
      })
      return true
    }
  },
  formSubmit: function (e) {
    let data = this.data
    //是否填信息
    if (this.tip(!data.desc, '请输入详细描述')) return;
    //上传图片
    this.submit()
  }
})