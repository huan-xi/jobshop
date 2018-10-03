/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data, s) {
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      'Token': getApp().globalData.token
    },
    success: function (e) {
      
      //POST拦截
      if (e.data.status == 4003) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '你还未登入是否去登入',
          confirmText: '去登入',
          success: function (e) {
            //清空Token
            getApp().globalData.token = '';
            wx.setStorageSync('Token', '')
            if (e.confirm) {
              //跳转登入
              wx.switchTab({
                url: '/pages/user/user',
              })
            }
          }
        })
        return
      }
      s(e.data);
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络错误',
      })
    }
  })
}
function uploadFile(url, filePath, name, s) {
  wx.uploadFile({
    url: url,
    filePath: filePath,
    name: name,
    header: {
      'Token': getApp().globalData.token
    },
    success: function (e) {
      //UPLOAD拦截
      console.log(e.data)
      var data={}
      try{
         data = JSON.parse(e.data)
      }catch(e){
        data=JSON.parse(e)
        data = JSON.parse(e.data)
      }
      if (data.status == 4003) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '你还未登入是否自动登入',
          confirmText: '去登入',
          success: function (e) {
            //清空Token
            getApp().globalData.token = '';
            wx.setStorageSync('Token', '')
            if (e.confirm) {
              //跳转登入
              wx.switchTab({
                url: '/pages/user/user',
              })
            }
          }
        })
        return
      } 
      s(data);
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络错误',
      })
    }
  })
}
function getRequest(url, s) {
  wx.request({
    url: url,
    header: {
      'Token': getApp().globalData.token
    },
    success: function (e) {
      //GET拦截
      if (e.data.status == 4003) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '你还未登入是否自动登入',
          confirmText: '去登入',
          success: function (e) {
            //清空Token
            getApp().globalData.token = '';
            wx.setStorageSync('Token', '')
            if (e.confirm) {
              //跳转登入
              wx.switchTab({
                url: '/pages/user/user',
              })
            }
          }
        })
        return
      }
      s(e.data);
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络错误',
      })
    }
  })
}
module.exports = {
  post: postRequest,
  get: getRequest,
  uploadFile: uploadFile
}