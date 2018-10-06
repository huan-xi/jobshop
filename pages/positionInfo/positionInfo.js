var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var auth = require('../../utils/auth.js');
var util = require('../../utils/util.js');
var id;
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
    count: 0,
    desc: '',
    salary: 0,
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
  onLoad: function(option) {
    var that = this
    id = option.id
    wxRequest.get(api.getPosition(option.id), e => {
      console.log(e)
      var data = e.msg
      //数据回写
      try {
        that.setData({
          startTime: util.formatTime(new Date()),
          workTime: util.formatTime(new Date(data.createTime)),
          endTime: util.formatTimeAdd(new Date()),
        })
        //工种回显示
        wxRequest.get(api.getTypes, e => {
          var types = []
          var typeIndex = 0
          for (var i = 0; i < e.msg.length; i++) {
            types.push(e.msg[i].sValue)
            if (data.type == e.msg[i].sValue)
              typeIndex = i
          }
          //计时方式回写
          var isByTiem = true
          var workTypeIndex = 0
          if (data.salary == -1) {
            isByTiem = false
            workTypeIndex = 1
            data.salary = ''
          }
          var salatyTypeIndex = 0
          //单位回写
          for (var i = 0; i < that.data.salatyType.length; i++) {
            if (data.salaryType == that.data.salatyType[i]) {
              salatyTypeIndex = i
              break
            }
          }
          that.setData({
            types: types,
            src: data.videoSrc,
            salary: data.salary,
            count: data.count,
            desc: data.positionDesc,
            typeIndex: typeIndex,
            isByTiem: isByTiem,
            salatyTypeIndex: salatyTypeIndex,
            workTypeIndex: workTypeIndex,
          })
        })
      } catch (e) {
        console.log(e)
        wx.showModal({
          title: '警告',
          content: '页面发生错误，请刷新后重试',
        })
      }
    });
  },
  //选择视频
  chooseVideo: function() {
    var that = this
    wx.chooseVideo({
      maxDuration: 60,
      success: function(res) {
        console.log(res)
        console.log(res.tempFilePath)
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
  submit: function() {

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
    //失败
    function dofail(e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: e,
        showCancel: false
      })
    }
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
          //开始发布职位
          wx.showLoading({
            title: '正在修改职位信息',
          })
          wxRequest.post(api.editPosition, {
            "positionId": id,
            "type": thatdata.types[thatdata.typeIndex],
            "time": new Date(thatdata.workTime).getTime(),
            "salary": val.salary,
            "count": val.count,
            "positionDesc": val.desc,
            "videoSrc": ossSrc,
            "salaryType": thatdata.salatyType[thatdata.salatyTypeIndex],
          }, function(e) {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showToast({
                title: '修改成功',
              })
              wx.switchTab({
                url: '/pages/position/position',
              })
            } else {
              if (e.msg) {
                wx.showModal({
                  title: '提示',
                  content: e.msg,
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: "修改失败",
                  showCancel: false
                })
              }
            }
          })
        } else {
          dofail('上传视频失败')
        }
      });
      //提交
      return
    }
    //提交
    //开始发布职位
    wx.showLoading({
      title: '修改职位信息',
    })
    wxRequest.post(api.editPosition, {
      "positionId": id,
      "type": thatdata.types[thatdata.typeIndex],
      "time": new Date(thatdata.workTime).getTime(),
      "salary": val.salary,
      "count": val.count,
      "positionDesc": val.desc,
      "videoSrc": ossSrc,
      "salaryType": thatdata.salatyType[thatdata.salatyTypeIndex],
    }, function(e) {
      wx.hideLoading()
      if (e.status == 1) {
        wx.showToast({
          title: '修改成功',
        })
        wx.switchTab({
          url: '/pages/position/position',
        })
      } else {
        if (e.msg) {
          wx.showModal({
            title: '提示',
            content: e.msg,
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "修改失败",
            showCancel: false
          })
        }
      }
    })

  }
})