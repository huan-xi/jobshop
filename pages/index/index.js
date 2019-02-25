const api = require('../../utils/api.js');
const wxRequest = require('../../utils/wxRequest.js')
const auth = require('../../utils/auth.js');
const util = require('../../utils/util.js');
const qiniuUploader = require("../../utils/qiniuUploader")
let ossImages = []
Page({
  data: {
    desc: '',
    notice: '',
    loop: false,
    images: [],
    checked:true,
  },

  onPullDownRefresh: function() {
    wxRequest.get(api.getNotice, e => {
      if (e.status == 1) {
        var loop = false
        if (e.msg.length > 20)
          loop = true
        this.setData({
          notice: e.msg,
          loop,
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  onLoad: function() {
    wxRequest.get(api.getNotice, e => {
      if (e.status == 1) {
        var loop = false
        if (e.msg.length > 20)
          loop = true
        this.setData({
          notice: e.msg,
          loop,
        })
      }
    })
  },
  toReader(){
    wx.navigateTo({
      url: '/pages/reader/reader',
    })
  },
  readerChange(val){
    let checked= val.detail.current
    this.setData({
      checked
    })
  },
  //选择图片
  choosePic: function() {
    var that = this
    wx.chooseImage({
      sizeType:'compressed',
      count:1,
      success: function(res) {
        let images = that.data.images
        images.push(res.tempFilePaths[0])
        that.setData({
          images,
        })
      },
      fail:function(e){
          console.log(e)
      }
    })
  },
  deletePic(e) {
    let index = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定要删除该张图片吗',
      success: res => {
        if (res.confirm) {
          let images = this.data.images
          images.splice(index, 1)
          this.setData({
            images,
          })
        }
      }
    })
  },
  descInputChange: function(e) {
    var desc = e.detail.value
    this.setData({
      desc: desc
    })
  },
  //上传文件
  //传入地址数组和当前上传个数
  uploadFile(src, i) {
    if (i >= 0&&ossImages.length<src.length) {
      //上传图片到七牛云
      qiniuUploader.upload(src[i], res => {
        ossImages.push(res.imageURL)
        this.uploadFile(src, i - 1)
      }, (error) => {
        wx.hideLoading()
        throw new Error("上传图片失败");
        console.log('error: ' + error);
      }, {
        region: 'SCN', // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
        uptokenURL: api.uptoken,
      })
    } else {
      //全部上传完成
      wx.hideLoading()
      //上传成功
      wx.showToast({
        title: '上传成功',
      })
      this.submit()
    }
  },
  //提交信息
  submit: function() {
    var that = this
    wx.showLoading({
      title: '正在发布职位',
    })
    wxRequest.post(api.publicPosition, {
      desc: that.data.desc,
      ossImages,
    }, function(e) {
      wx.hideLoading()
      if (e.status == 1) {
        //清空数据
        ossImages=[]
        that.setData({
          desc:'',
          images:[]
        })
        wx.showModal({
          title: '提示',
          content: '发布成功，你可以在已经发布页面查看',
          confirmText: "查看发布",
          success: e => {
            if (e.confirm) {
              wx.switchTab({
                url: '/pages/position/position',
              })
            }
          }
        })
      } else {
        /*
        wx.showModal({
          title: '提示',
          content: e.msg,
          showCancel: false
        })*/
      }
    })
  },
  //错误提示
  tip: function(isNot, content) {
    if (isNot) {
      wx.showModal({
        title: '提示',
        content: content,
        showCancel: false
      })
      return true
    }
  },
  formSubmit: function(e) {
    let data = this.data
    //是否阅读
    if (this.tip(!data.checked, '请阅读发布须知')) return;
    //是否填信息
    if (this.tip(!data.desc, '请输入详细描述')) return;
    //上传图片
    if (data.images.length > 0) {
      wx.showLoading({
        title: '正在上传图片',
      })
      try {
        this.uploadFile(data.images, data.images.length - 1)
      } catch (e) {
        console.log(e);
        wx.showModal({
          title: '错误',
          content: e.message,
          showCancel: false
        })
      }
      return
    }
    this.submit()
  }
})