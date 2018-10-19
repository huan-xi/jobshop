var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page = 1;
var size = 5;
var total = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    isFinish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  notFinishTap: function (e){
    this.setData({
      isFinish: false
    })
    this.refresh()
  },
  finishTap:function(e){
    this.setData({
      isFinish: true
    })
    this.refresh()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refresh();
  },
  refresh: function() {
    var that = this
    wx.showLoading({
      title: '正在获取数据',
    })
    var type=this.data.isFinish?0:1
    wxRequest.get(api.getOrders(page, size,type), e => {
      console.log(e)
      wx.hideLoading()
      if (e.status == 1) {
        var orders = e.msg.rows
        console.log(orders)
        //返回状态信息状态过滤
        for (var i = 0; i < orders.length; i++) {
          orders[i].notFinish = true
          switch (orders[i].pOrder.status) {
            case '1':
              orders[i].pOrder.status = '该用户已接单，赶快联系他吧！'
              break
            case '3':
              orders[i].notFinish=false
              orders[i].pOrder.status = '已完成！'
              break
            case '4':
              orders[i].notFinish = false
              orders[i].pOrder.status = '用户取消'
              break
            case '5':
              orders[i].notFinish = false
              orders[i].pOrder.status = '用户取消'
              break
            case '8':
              orders[i].pOrder.status = '您已取消'
              break
            default:
              orders[i].pOrder.status = '未知状态'
          }
        }
        //放回信息时间过滤
        for (var i = 0; i < orders.length; i++) {
          orders[i].position.time = util.formatTime(new Date(orders[i].position.time))
        }
        that.setData({
          orders: orders
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '提交异常',
          showCancel: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  callTap: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
    })
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
    var that = this
    console.log(page)
    if (total % size == 0 && page >= total / size) return
    if (page > total / size) return
    page++
    this.refresh()
  },
  cancelTap:function(e){
    wxRequest.get(api.cancelOrder(e.target.id), e =>{
      console.log(e)
    })
    console.log(e.target.id)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})