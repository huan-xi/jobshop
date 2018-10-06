//app.js
App({
  onLaunch: function () {
    var that = this
    wx.getStorage({
      key: 'Token',
      success: function (res) {
        that.globalData.token = res.data
      },
    })
  },
  globalData: {
    token: ''
  }
})