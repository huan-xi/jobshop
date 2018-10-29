// pages/position/position.js
var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page = 1
var size = 5
var total = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    positions: [],
    myFormat: ['时', '分', '秒'],
    clearTimer: false,
    cTime: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  editTap: function(e) {
    wx.navigateTo({
      url: `/pages/positionInfo/positionInfo?id=${e.target.id}`,
    })
  },
  refresh: function(hidden) {
    wxRequest.get(api.getTime, e => {
      var cTime = e
      if (!hidden)
        wx.showLoading({
          title: '正在加载数据',
        })
      var that = this
      var type = 0;
      wxRequest.get(api.getPositions(page, size, type), e => {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (e.status == 1) {
          total = e.msg.total
          //时间状态过滤
          var positions = e.msg.rows
          //返回状态信息状态过滤
          var time1 = 10000 //第一次等待时间
          var time2 = 20000 //第二次等待时间
          for (var i = 0; i < positions.length; i++) {
            //倒计时处理 
            //两分钟之前创建
            if (cTime - positions[i].createTime < time1) {
              positions[i].target = positions[i].createTime + time1
              positions[i].target2 = positions[i].createTime + time2
            } else
              positions[i].target = positions[i].createTime + time2
            if (positions[i].status == 1) {
              positions[i].status = '正常'
            } else if (positions[i].status == 2) {
              positions[i].positions = '已完成'
            } else if (positions[i].status == 3) {
              positions[i].status = '已取消'
            } else {
              positions[i].status = '正常'
            }
            positions[i].time = util.formatTime(new Date(positions[i].time))
          }
          var positions = that.data.positions.concat(e.msg.rows)
          this.setData({
            positions: positions,
            cTime:cTime
          })
        }
      });
    })
  },
  myLinsterner: function(e) { //倒计时完成回调
    //43200000
    var index = e.target.dataset.index;
    var positions = this.data.positions;
    positions[index].status = '已结束'
    this.setData({
      positions: positions
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    page = 1
    this.data.positions = []
    this.refresh();
  },
  deleteTap: function(e) {
    var that = this
    var id = e.currentTarget.id
    //删除
    wx.showModal({
      title: '提示',
      content: '删除职位信息后将不再展示，确定删除吗？',
      confirmText: '删除',
      success: e => {
        if (e.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          //开始删除
          wxRequest.get(api.deletePosition(id), e => {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              page = 1
              that.data.positions = []
              that.refresh()
            } else
              wx.showModal({
                title: '提示',
                content: e.msg,
              })

          })
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    page = 1
    this.data.positions = []
    this.refresh(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (total % size == 0 && page >= total / size) return
    if (page > total / size) return
    page++
    this.refresh()
  },
})