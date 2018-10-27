var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**d
   * 页面的初始数据
   */
  data: {
    address: '',
    vender: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //数据加载
    wx.getStorage({
      key: 'vender',
      success: function(res) {
        var address = {}
        address.latitude = res.data.latitude
        address.longitude = res.data.longitude
        address.name = res.data.address
        that.setData({
          vender: res.data,
          address: address
        })
      },
    })
  },
  //双向绑定
  nameInputChange:function(e){
    var vender=this.data.vender
    vender.name =e.detail.detail.value
    this.setData({
      vender
    })
  },
  contactsInputChange: function (e) {
    var vender = this.data.vender
    vender.contacts = e.detail.detail.value
    this.setData({
      vender
    })
  },
  phoneInputChange: function (e) {
    var vender = this.data.vender
    vender.phone = e.detail.detail.value
    this.setData({
      vender
    })
  },
  address_descInputChange: function (e) {
    var vender = this.data.vender
    vender.addressDesc = e.detail.detail.value
    this.setData({
      vender
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
  formSubmit: function(e) {
    //数据校验
    var val = this.data.vender
    if (this.tip(val.name.length < 3, '公司名至少三个字')) 
        return
    if (this.tip(val.contacts.length < 2, '请填写正确的联系人名字')) 
      return
    if (this.tip(val.phone.length != 11, '请填写正确的手机号'))
      return;
    var addressV = this.data.address;
    if (this.tip(!(addressV.name && addressV.latitude && addressV.longitude), '请选择公司所在地址'))
      return;
    if (this.tip(val.addressDesc.length < 5, '请输入地址详细描述(至少五个字)'))
      return;
    //提交信息  
    wx.showLoading({
      title: '正在提交信息',
    })
    try {
      var addressD = this.data.address
      var  address = addressD.name
      wxRequest.post(api.editInfo, {
        phone: val.phone,
        name: val.name,
        contacts: val.contacts,
        addressDesc: val.addressDesc,
        address: address,
        latitude: addressD.latitude,
        longitude: addressD.longitude
      }, e => {
        wx.hideLoading()
        if (e.status == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          //修改数据
          wx.setStorageSync("isChange", 'true');
          //跳转页面
          wx.navigateBack()
        } else {
          wx.showModal({
            title: '提示',
            content: '修改信息失败',
          })
        }
      })
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '页面出现错误请重新进入页面再试',
      })
    }

  },
  onChangeAddress: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        if (res.name)
          that.setData({
            address: res
          })
      },
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
})