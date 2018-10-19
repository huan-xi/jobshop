var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var auth = require('../../utils/auth.js');
var util = require('../../utils/util.js');
Page({
  data: {
    types: ['正在加载数据...'],
    typeIndex: 0,
    workTime: '',
    startTime: '',
    endTime: '',
    workType: ['计时', '计件'],
    workTypeIndex: 0,
    salatyType: ['元/小时', '元/2小时', '元/3小时', '元/4小时', '元/5小时', '元/6小时', '元/7小时', '元/8小时', '元/9小时', '元/10小时', '元/11小时', '元/12小时'],
    salatyTypeIndex: 0,
    src: '',
    isByTiem: true, //是否是计时模式
    address: {
      name: '选择地点'
    }
  },
  bindTimePickerChange: function(e) {
    this.setData({
      workTime: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //页面数据显示
    try {
      var that = this
      that.setData({
        startTime: util.formatTime(new Date()),
        workTime: util.formatTime(new Date()),
        endTime: util.formatTimeAdd(new Date()),
      })
      wxRequest.get(api.getTypes, e => {
        var types = []
        for (var i = 0; i < e.msg.length; i++) {
          types.push(e.msg[i].sValue)
        }
        that.setData({
          types: types,
        })
      })
    } catch (e) {
      console.log(e)
      wx.showModal({
        title: '警告',
        content: '页面发生错误，请刷新后重试',
      })
    }
  },
  //选择视频
  chooseVideo: function() {
    var that = this
    wx.chooseVideo({
      maxDuration: 60,
      success: function(res) {
        if (res.size / res.duration > 300 * 1024) {
          wx.showModal({
            title: '提示',
            content: '您的机型暂不支持拍照直接压缩，请先拍完后再从相册中选择上传！',
            showCancel: false
          })
          return;
        }
        that.setData({
          src: res.tempFilePath,
        })
      }
    })
  },
  bindPickerUnitChange: function(e) {

  },
  bindPickerChange: function(e) {
    var isByTiem;
    if (e.detail.value != 0) isByTiem = false
    else isByTiem = true
    this.setData({
      workTypeIndex: e.detail.value,
      isByTiem: isByTiem,
    })
  },
  bindPickerUnitChange: function(e) {
    this.setData({
      salatyTypeIndex: e.detail.value
    })
  },
  bindTypeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  submit: function(thatdata,val,ossSrc) {
    var that=this
    //开始发布职位
    wx.showLoading({
      title: '正在发布职位',
    })
    wxRequest.post(api.publicPosition, {
      "type": thatdata.types[thatdata.typeIndex],
      "time": new Date(thatdata.workTime).getTime(),
      "salary": val.salary,
      "count": val.count,
      "positionDesc": val.desc,
      "videoSrc": ossSrc,
      "salaryType": thatdata.salatyType[thatdata.salatyTypeIndex],
    }, function (e) {
      wx.hideLoading()
      if (e.status == 1) {
        console.log(e)
        wx.showModal({
          title: '提示',
          content: '发布成功，你可以在两分钟之内做修改',
          confirmText: "查看发布",
          success: e => {
            if (e.confirm) {
              wx.switchTab({
                url: '/pages/position/position',
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: e.msg,
          showCancel: false
        })
      }
    })
  },
  formSubmit: function(e) {
    var val = e.detail.value
    var ossSrc = ''
    var thatdata = this.data
    var that = this
    //数据校验
    if (!val.count) {
      wx.showModal({
        title: '提示',
        content: '请输入招工人数',
        showCancel: false
      })
      return
    }
    if (this.data.isByTiem && !val.salary) {
      wx.showModal({
        title: '提示',
        content: '请输入大概工资',
        showCancel: false
      })
      return
    }
    if (!this.data.isByTiem) {
      val.salary = -1;
    }
    if (!val.desc) {
      wx.showModal({
        title: '提示',
        content: '请输入详细描述',
        showCancel: false
      })
      return
    }
    //是否填信息
    if (thatdata.src && thatdata.src.length > 0) {
      //上传文件再提交
      wx.showLoading({
        title: '正在上传文件',
      })
      wxRequest.uploadFile(api.uploadVideo, thatdata.src, 'video', function(e) {
        if (e.status == 1) {
          //成功
          wx.hideLoading()
          ossSrc = e.msg
          that.submit(thatdata,val,ossSrc)
        } else {
          wx.showModal({
            title: '提示',
            content: '上传视频失败',
          })
          return
        }
      });
      return
    }
    that.submit(thatdata, val,'')
  }
})