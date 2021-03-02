//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const dateformat = require('../../utils/dateformat.js')
const plugin = requirePlugin("WechatSI")

// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext();
 


Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTranslate: {
      // 当前语音输入内容
      create: '04/27 15:37',
      text: '等待说话',
    },
    recording: false,  // 正在录音
    recordStatus: 0,   // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecordAuth();
    this.initRecord();
  },
  /**
    * 按住按钮开始语音识别
    */
  streamRecord: function (e) {
    // console.log("streamrecord" ,e)
    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}
    manager.start({
      lang: "zh_CN",
    })
    this.setData({
      recordStatus: 0,
      recording: true,
      currentTranslate: {
        // 当前语音输入内容
        create: util.recordTime(new Date()),
        text: '正在聆听中',
        lfrom: "zh_CN",
        lto: "zh_CN",
      },
    })

  },


  /**
   * 松开按钮结束语音识别
   */
  streamRecordEnd: function (e) {
    // console.log("streamRecordEnd" ,e)
    let detail = e.detail || {}  // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}
    // 防止重复触发stop函数
    if (!this.data.recording || this.data.recordStatus != 0) {
      console.warn("has finished!")
      return
    }
    manager.stop()
    this.setData({
      bottomButtonDisabled: true,
    })
  },


  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let currentData = Object.assign({}, this.data.currentTranslate, {
        text: res.result,
      })
      this.setData({
        currentTranslate: currentData,
      })
      // this.scrollToNew();
    }

    // 识别结束事件
    manager.onStop = (res) => {
      // 取出录音文件识别出来的文字信息
      let text = res.result
      // 获取音频文件临时地址
      let filePath = res.tempFilePath
      let duration = res.duration

      if (text == '') {
        this.showRecordEmptyTip()
        return
      }
      if (res.duration < 1000) {
        util.showTips('录音时间过短')
        return
      }
      //这里是项进行的处理时间
      console.log("-----------------")
      console.log(text)
      this.setData({
        // currentTranslate: currentData,
        recordStatus: 1,
        // lastId: lastId,
      })
      this.loginCoolead(text)
      // let lastId = this.data.lastId + 1

      wx.saveFile({
        tempFilePath: filePath,
        success: fileInfo => {
          const { savedFilePath } = fileInfo;
          const voiceKey = `historyRecords-${Date.now()}`
          // 生成笔记并保存再 storage
        },
        fail() {
          util.showModel('错误', '保存语音失败');
        }
      });
    }

    // 识别错误事件
    manager.onError = (res) => {
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
      })

    }
  },

  /**
    * 识别内容为空时的反馈
    */
  showRecordEmptyTip: function () {
    this.setData({
      recording: false,
      // bottomButtonDisabled: false,
    })
    wx.showToast({
      title: "未识别到语音,请大声说话",
      icon: 'success',
      image: '../../images/no_voice.png',
      duration: 1500,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });
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

  loginCoolead(text) {
    if (text.indexOf("登录") != -1) {
      wx.request({
        url: 'https://ed.coolead.com/api/auth/tokenForApp',
        header: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        data: {
          "grantType": "password",
          "userName": "duzhen",
          "password": "000000"
        },
        success(res) {
          console.log(res)
          util.showTips("登录成功")
        },
        fail(err) {
          console.log(err)
          util.showToast("登录失败")
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    console.log("onHide")
    try {
      wx.removeStorageSync('historyRecords')
    } catch (e) {
      // Do something when catch error
      console.log("清除缓存失败:")
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
    try {
      wx.removeStorageSync('historyRecords')
    } catch (e) {
      // Do something when catch error
      console.log("清除缓存失败:")
    }
  },


})


