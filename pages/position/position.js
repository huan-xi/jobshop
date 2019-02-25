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
  onLoad: function() {
    page = 1
    this.data.positions = []
    this.refresh()
  },
  editTap: function(e) {
    let id = e.target.id
    let index = e.currentTarget.dataset.index
    let that = this
    if (this.data.positions[index].status == 1) {
      wx.navigateTo({
        url: `/pages/positionInfo/positionInfo?id=${id}`,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定重新发布吗，重新发布后会再次被展示',
        confirmText: '重新发布',
        success: function(e) {
          if (e.confirm) {
            wxRequest.get(api.republic(id), function(e) {
              if (e.status == 1) {
                that.onLoad()
              }
            });
          }
        }
      })
    }
  },
  refresh: function(hidden) {
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
  onShow: function() {
    let that=this
    wx.getStorage({
      key: 'jobChange',
      success: function(res) {
        console.log(res)
        if (res.errMsg =="getStorage:ok"&&res.data){
          that.onLoad()
          wx.setStorageSync('jobChange', false)
        }
      },
    })
  },
  deleteTap: function(e) {
    let id = e.target.id
    let index = e.currentTarget.dataset.index
    let that = this
    if (this.data.positions[index].status == 1) {
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
                that.onLoad()
              } else
                wx.showModal({
                  title: '提示',
                  content: e.msg,
                })

            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定永久删除该工作信息吗？',
        confirmText: '删除',
        success: e => {
          if (e.confirm) {
            wx.showLoading({
              title: '正在删除',
            })
            //开始删除
            wxRequest.get(api.destroyJob(id), e => {
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
    }
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