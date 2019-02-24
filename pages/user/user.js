var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var auth = require('../../utils/auth.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vender: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (getApp().globalData.token) {
      this.refresh()
    }
  },
  clear: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '清除缓存将会退出登入，确定要清除吗？',
      success: e => {
        if (e.confirm)
          that.exit()
      }
    })
  },
  exit: function(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
    getApp().globalData.token=''
    wx.clearStorageSync()
  },
  toEdit: function(e) {
    wx.navigateTo({
      url: '/pages/update/index',
    })
  },
  refresh: function(isPull) {
    if(!isPull)
    wx.showLoading({
      title: '正在获取信息',
    })
    wxRequest.get(api.getInfo, e => {
      wx.hideLoading()
      if(isPull) wx.stopPullDownRefresh();
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
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    auth.isLogin(() => {
      //成功回调
      that.refresh()
    });
    //刷新数据(是否更新)    
    wx.getStorage({
      key: 'isChange',
      success: function(res) {
        if (res.data) {
          wx.setStorageSync('isChange', false)
          //刷新数据
          that.refresh()
        }
      },
    })
  },
  call() {
    wxRequest.get(api.getPhone, res => {
      if (res.status == 1) {
        wx.makePhoneCall({
          phoneNumber: res.msg,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '没有客服信息',
          showCancel: false
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refresh(true)
  },

})