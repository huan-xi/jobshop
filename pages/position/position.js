// pages/position/position.js
var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page = 1;
var size = 5
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positions: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  editTap:function(e){
    wx.navigateTo({
      url: `/pages/positionInfo/positionInfo?id=${e.target.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  refresh: function() {
    wxRequest.get(api.getPositions(1, 5), e => {
      console.log(this)
      console.log(e)
      if(e.status==1){
        //时间状态过滤
        var positions = e.msg.rows
        //返回状态信息状态过滤
        for (var i = 0; i < positions.length; i++) {
          if (positions[i].status == 1) {
            positions[i].positions = '正常'
          } else if (positions[i].status == 2) {
            positions[i].positions = '已完成'
          } else if (positions[i].status == 3) {
            positions[i].status = '已取消'
          }else{
            positions[i].status = '正常'
          }
          positions[i].time = util.formatTime(new Date(positions[i].time))
        }
        this.setData({
          positions:positions
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refresh();
  },

  deleteTap:function(e){
    //删除
    wx.showModal({
      title: '提示',
      content: '删除职位信息后将不再展示，确定删除吗？',
      confirmText:'删除',
      success:e =>{
        if(e){
          //开始删除
        }
      }
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