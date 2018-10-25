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
    count:0,
    desc:'',
    salary:'',
    workType: ['计时', '计件'],
    workTypeIndex: 0,
    salatyType: ['1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '9小时', '10小时', '11小时', '12小时'],
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
  //输入框事件实现双向绑定
  countInputChange:function(e){
    var count=e.detail.value
    this.setData({
      count:count
    })
  },
  salaryInputChange: function (e) {
    var salary = e.detail.value
    this.setData({
      salary: salary
    })
  },
  descInputChange: function (e) {
    var desc = e.detail.detail.value
    this.setData({
      desc: desc
    })
  },
  //提交信息
  submit: function(data, val, ossSrc) {
    var that = this
    wx.showLoading({
      title: '正在发布职位',
    })
    wxRequest.post(api.publicPosition, {
      "type": data.types[data.typeIndex],
      "time": new Date(data.workTime).getTime(),
      "salary":  data.salary,
      "count": data.count,
      "positionDesc": data.desc,
      "videoSrc": ossSrc,
      "salaryType": "元/" + data.salatyType[data.salatyTypeIndex],
    }, function(e) {
      wx.hideLoading()
      if (e.status == 1) {
        wx.showModal({
          title: '提示',
          content: '发布成功，你可以在两分钟之内做修改，两分钟过后将展示12小时',
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
  //错误提示
  tip: function(isNot, content) {
    if (isNot) {
      wx.showModal({
        title: '提示',
        content: content,
        showCancel: false
      })
      return true
    }
  },
  formSubmit: function(e) {
    var ossSrc = ''
    var data = this.data
    var val=data.value
    var that = this
    //数据校验
    if (that.tip(!data.count, '请输入招工人数'))
        return
    if (that.tip(data.isByTiem && ! data.salary, '请输入大概工资'))
      return
    if (!data.isByTiem) {
      data.salary = -1;
    }
    if (that.tip(!data.desc, '请输入详细描述'))
      return
    //是否填信息
    if (data.src && data.src.length > 0) {
      //上传文件再提交
      wx.showLoading({
        title: '正在上传文件',
      })
      wxRequest.uploadFile(api.uploadVideo, data.src, 'video', function(e) {
        if (e.status == 1) {
          //成功
          wx.hideLoading()
          ossSrc = e.msg
          that.submit(data, val, ossSrc)
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
    that.submit(data, val, '')
  }
})