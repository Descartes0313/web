const app = getApp();
const htmldata = require('./htmldata');

//index.js 页面引入

let jsondata = require('../list/menu4/menu_data_4.js');

Page({
  data: {
    json:'',
    htmldata: htmldata

  },
  changeFather(e) {
    console.log("当前选择第"+(parseInt(e.detail.toString())+1).toString()+"个父菜单")

  },
  changeChild(e) {
    console.log("当前选择第" + (parseInt(e.detail.toString())+1).toString() + "个子菜单")
  },
  onLoad() {
    var that = this;
    that.setData({
      json: jsondata.dataList ,
      html: htmldata
    })

    console.log('json数据如下')
    console.log(that.data.json)
  }
});
