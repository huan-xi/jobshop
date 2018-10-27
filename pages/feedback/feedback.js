var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    contact: '',
    phone:"",
    name:''
  },
  textInput: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  contactInput: function(e) {
    this.setData({
      contact: e.detail.detail.value
    })
  },
  tip: function(isNot, text) {
    if (isNot) {
      wx.showModal({
        title: '提示',
        content: text,
        showCancel: false
      })
      return true
    }
    return false
  },
  formSubmit: function() {
    if (this.tip(this.data.text.length < 6, "反馈信息至少五个字"))
      return
    if (this.tip(this.data.contact.length < 6, "请认真填写联系方式"))
      return
    wxRequest.post(api.feedback,{
      text:this.data.text,
      contact:this.data.contact
    },e=>{
      if(e.status==1)
      {
        wx.showToast({
          title: e.msg,
        })
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/user/user',
          })
        },1000)
        
      }else{
        wx.showModal({
          title: '提示',
          content: e.msg,
          showCancel:false
        })
      }
    })
  },
  makeCall:function(){
    if (this.data.phone == '未设置'||this.data.phone == '')
      wx.showModal({
        title: '提示',
        content: '没有客服信息',
      })
      else{
        wx.makePhoneCall({
          phoneNumber: this.data.phone,
        })
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wxRequest.get(api.getServiceInfo,e=>{
      if(e.status==1)
      this.setData({
        phone:e.msg.phone,
        name: e.msg.name
      })
    });
  },
})