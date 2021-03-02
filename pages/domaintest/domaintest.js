// pages/domaintest/domaintest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webcontent : ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuestion()
  },

  getQuestion(newQuestion){
    let that = this
    wx.request({
      //这里如果想把他放在服务器的话可以用自己服务器的公网ip地址
       url: 'https://mylifemeaning.cn/',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        newQuestion: newQuestion
      },
      success: ret => {
        try {
          console.log('测试请求结果',JSON.stringify(ret))
          that.setData({
            webcontent: JSON.stringify(ret)
          })
        } catch (e) {
          console.log(e)
        }
      }
    })
  },


})