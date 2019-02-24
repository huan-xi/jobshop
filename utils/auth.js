var api = require('api.js');
module.exports = {
  //登入判断
  isLogin: function(s) {
    var that = this
    if (!getApp().globalData.token) {
      that.login(s);
    }
  },
  login: function(s) {
    wx.showLoading({
      title: '登入中',
    })
    wx.login({
      success: res => {
        wx.request({
          url: api.login,
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function(e) {
            e = e.data
            wx.hideLoading()
            if (e.status == 1) {
              //登入成功
              getApp().globalData.token = e.msg;
              wx.setStorageSync('Token', e.msg)
              wx.showToast({
                title: '登入成功',
                icon: 'success',
              })
              s()
            } else {
              wx.showModal({
                title: '提示',
                content: e.msg,
                showCancel: false,
                success: e => {
                  wx,
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              })
            }
          }
        })
      }
    })
  },
}