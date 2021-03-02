const app = getApp();

//index.js 页面引入
let jsondata_1 = require('menu_data_1.js');

Page({
  data: {
  },
  changeFather(e) {
    console.log("当前选择第" + (parseInt(e.detail.toString()) + 1).toString() + "个父菜单")

  },
  changeChild(e) {
    console.log("当前选择第" + (parseInt(e.detail.toString()) + 1).toString() + "个子菜单")
  },
  onLoad() {
    var that = this;
    that.setData({
      data_1: jsondata_1.dataList_1,
    })

    console.log('json数据如下')
    console.log(that.data.data_1)
  }
});
