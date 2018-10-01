/*require('../../lib/es6-promise.min.js')
require('../../lib/aliyun-oss-sdk-5.2.0.min.js')
require('../../lib/aliyun-upload-sdk-1.4.0.min.js')
*/
Page({
  data: {
    isPublic: true,
    types: ['工种1', '工种2', '工种6', '工种5', '工种4', '工种3'],
    typeIndex:0,
    workTime: '2016-01-01',
    workType: ['计时', '计件'],
    workTypeIndex: 0,
    salatyType: ['元/小时', '元/2小时', '元/3小时', '元/12小时'],
    salatyTypeIndex: 0,
    src: '',
    isByTiem:true,//是否是计时模式
    address: {
      name: '选择地点'
    }
  },
  orderTap: function(e) {
    this.setData({
      isPublic: false
    })
  },
  //选择视频
  chooseVideo: function() {
    var that = this
    wx.chooseVideo({
      maxDuration:60,
      success: function(res) {
        console.log(res.size)
        console.log(res.tempFilePath)
        that.setData({
          src: res.tempFilePath,
        })
      }
    })
  },
  bindPickerUnitChange:function(e){

  },
  onChangeAddress: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        if (res.name)
          that.setData({
            address: res
          })
        console.log(res)
      },
    })
  },
  publicTap: function(e) {
    this.setData({
      isPublic: true
    })
  },
  orderTap: function(e) {
    this.setData({
      isPublic: false
    })
  },
  bindPickerChange: function (e) {
    var isByTiem;
    if (e.detail.value!=0) isByTiem=false
    else isByTiem=true
    this.setData({
      workTypeIndex: e.detail.value,
      isByTiem:isByTiem,
    })
  },
  bindPickerUnitChange: function (e) {
    this.setData({
      salatyTypeIndex: e.detail.value
    })
  },
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  formSubmit: function(e) {
    var val = e.detail.value
    console.log(val);
    if (!val.salary) {
      wx.showModal({
        title: '提示',
        content: '请输入大概工资',
        showCancel: false
      })
      return
    }
    var address=this.data.address
    if (!(address.latitude && longitude))
    {
      wx.showModal({
        title: '提示',
        content: '请选择工作地点',
        showCancel: false
      })
      return
    }
    console.log(e.detail.value)
  }
})