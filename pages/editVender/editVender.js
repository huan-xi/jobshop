var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  formSubmit: function(e) {
    //数据校验
    var addressD= this.data.address
    var address = addressD.address +addressD.name
    var val = e.detail.value
    //提交信息  
    wx.showLoading({
      title: '正在提交信息',
    })
    try {
      wxRequest.post(api.editInfo, {
        phone: val.phone,
        name: val.name,
        contacts: val.contacts,
        addressDesc: val.address_desc,
        address:address,
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onChangeAddress: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        if (res.name)
          that.setData({
            address: res
          })
        console.log(res)
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