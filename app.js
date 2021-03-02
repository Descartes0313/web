import wxUtils from '/package/utils/Wx'
const utils = require('./utils/util.js')

App({
  globalData: {
    appId: 'wx0b3748b5cb479882', //这里修改成自己的
    appName: '解决方案',
    history: [],
  },

  onLaunch: function () {    //小程序初始化完成会触发
    var self = this;
    wxUtils.$wx_updateEdition();
    wxUtils.$wx_launch(this);
    //语音识别的库
    wx.getStorage({
      key: 'history',
      success: (res) => {
        this.globalData.history = res.data
      },
      fail: (res) => {
        console.log("get storage failed")
        console.log(res)
        this.globalData.history = []
      }
    })
  },

  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        console.log("fail")
        console.log(res)
      }
    })
  },

  onHide: function () {     //小程序进入后台
    wx.stopBackgroundAudio()
  },
  
})
