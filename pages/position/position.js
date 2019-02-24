// pages/position/position.js
var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page = 1
var size = 8
var total = 0
let isDelete = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: "show",
    positions: [],
    tip: "",
    isLoading: false
  },
  handleChange({
    detail
  }) {
    isDelete = detail.key == 'delete'
    this.setData({
      current: detail.key
    });
    page = 1
    this.data.positions = []
    this.refresh()
  },
  editTap: function (e) {
    wx.navigateTo({
      url: `/pages/positionInfo/positionInfo?id=${e.target.id}`,
    })
  },
  refresh: function (hidden) {
    if (!hidden)
      wx.showLoading({
        title: '正在加载数据',
      })
    var that = this
    var type = isDelete ? 2 : 1
    wxRequest.get(api.getPositions(page, size, type), e => {
      if (e.status == 1) {
        total = e.msg.total
        //返回状态信息状态过滤
        let positions = that.data.positions.concat(e.msg.rows)
        this.setData({
          tip: '没有更多数据了',
          isLoading: false,
          positions: positions,
        })
        if (hidden)
          wx.stopPullDownRefresh()
        else
          wx.hideLoading()
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    page = 1
    this.data.positions = []
    this.refresh();
  },
  deleteTap: function (e) {
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
  onPullDownRefresh: function () {
    page = 1
    this.data.positions = []
    this.refresh(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    this.setData({
      tip: '正在加载',
      isLoading: true
    })
    if ((total % 10 == 0 && page >= total / size) || (page > total / size)) {
      that.setData({
        tip: '没有更多数据了',
        isLoading: false
      })
      return
    }
    page++
    this.refresh(true)
  },
})