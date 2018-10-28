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
    isFinish: false,
    current: "finish"
  },
  handleChange({ detail }) {
    var isFinish=false
    if (detail.key == 'finish')
      isFinish = false
    else
      isFinish = true
    this.setData({
      isFinish: isFinish,
      current: detail.key
    });
    this.refresh()
  },

  deleteTap: function (e) {
    var id = e.target.id
    wx.showModal({
      title: '提示',
      content: '确定删除此订单',
      success: e => {
        if (e.confirm) {
          wxRequest.get(api.deleteOrder(id), e => {
            if (e.status == 1) {
              wx.showToast({
                title: e.msg,
              })
              this.refresh()
            } else
              wx.showModal({
                title: '警告',
                content: e.msg,
                showCancel: false
              })
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refresh();
  },
  refresh: function (isPull) {
    var that = this
    wx.showLoading({
      title: '正在获取数据',
    })
    var type = this.data.isFinish ? 0 : 1
    wxRequest.get(api.getOrders(page, size, type), e => {
      wx.hideLoading()
      if (isPull)
        wx.stopPullDownRefresh()
      if (e.status == 1) {
        var orders = e.msg.rows
        total = e.msg.total
        //返回状态信息状态过滤
        for (var i = 0; i < orders.length; i++) {
          orders[i].notFinish = true
          switch (orders[i].pOrder.status) {
            case '1':
              orders[i].pOrder.status = '该用户已接单，赶快联系他吧！'
              break
            case '3':
              orders[i].notFinish = false
              orders[i].pOrder.status = '已完成！'
              break
            case '4':
              orders[i].notFinish = false
              orders[i].pOrder.status = '用户取消'
              break
            case '5':
              orders[i].notFinish = false
              orders[i].pOrder.status = '已结束'
              break
            case '8':
              orders[i].notFinish = false
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
  //完成按钮点击
  finish: function (e) {
    var id = e.target.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定此订单已完成吗',
      success: e => {
        if (e.confirm) {
          //提交完成请求
          wx.showLoading({
            title: '正在提交请求',
          })
          wxRequest.get(api.finishOrder(id), e => {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showToast({
                title: '订单已完成',
              })
              that.refresh()
            } else {
              wx.showModal({
                title: '提示',
                content: e.msg,
                showCancel: false
              })
            }
          })
        }
      }
    })
  },
  callTap: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1
    this.data.orders = []
    this.refresh(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (total % size == 0 && page >= total / size) return
    if (page > total / size) return
    page++
    this.refresh()
  },
  cancelTap: function (e) {
    var id = e.target.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '取消前请确保和工人协商好，并且一天只能取消一次，确定要取消吗',
      success: e => {
        if (e.confirm) {
          wxRequest.get(api.cancelOrder(id), e => {
            if (e.status == 1) {
              wx.showToast({
                title: e.msg,
              })
              that.refresh()
            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: e.msg,
              })
            }
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})