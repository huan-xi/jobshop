var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var auth = require('../../utils/auth.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vender:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().globalData.token) {
      this.refresh()
    }
  },

  tosaveTap: function (e) {
    wx.navigateTo({
      url: '/pages/editVender/editVender',
      success: e => {
        console.log(e)
      }
    })
  },
  refresh: function () {
    wx.showLoading({
      title: '正在获取信息',
    })
    wxRequest.get(api.getInfo, e => {
      wx.hideLoading()
      if (e.status == 1) {
        var vender = e.msg 
        wx.setStorageSync('vender', vender);
        this.setData({
          vender: vender,
        })
      } else {
        //获取失败
        wx.showModal({
          title: '警告',
          content: '获取数据失败，请重新登入再试',
          showCancel: false
        })
        wx.setStorageSync("Token", "")
        getApp().globalData.token = ''
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    auth.isLogin(() => {
      //成功回调
      that.refresh()
    }); 
    //刷新数据(是否更新)    
    wx.getStorage({
      key: 'isChange',
      success: function (res) {
        if (res.data) {
          wx.setStorageSync('isChange', false)
          //刷新数据
          that.refresh()
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})