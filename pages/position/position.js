// pages/position/position.js
var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var page = 1;
var size = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positions: [{
      type:"fasd",
      time:"45454",
      count:10
    },
      {
        type: "fasd",
        time: "45454",
        count: 10
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.refresh();
  },
  positionTap:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/positionInfo/positionInfo',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  refresh: function() {
    wxRequest.get(api.getPositions(1, 10), e => {
      console.log(e)
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    /*console.log(this.data.positions.lenght)
    if (this.data.positions.length == 0) {
      this.refresh();
    }*/
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})