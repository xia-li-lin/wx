//index.js
//获取应用实例
const app = getApp()
const WXAPI=require('../../wxapi/main.js')
const CONFIG=require('../../config.js')

Page({
  data: {
    inputShowed:false,  // 搜索框样式切换
    inputVal:'',  // 搜索框内容
  },
  onLoad: function () {
    this.getNotice();
  },
  // 获取公共列表
  getNotice:()=>{
    WXAPI.getNotice({
      page:1,
      pageSize:5
    }).then((res)=>{
      console.log(res);
    })
  },
  // 以下为搜索框事件
  showInput:function(){
    this.setData({
      inputShowed:true
    })
  },
  hideInput:function(){
    this.setData({
      inputShowed:false
    })
  },
  clearInput:function(){
    this.setData({
      inputVal:''
    })
  },
  inputTyping:function(e){
    this.setData({
      inputVal:e.detail.value
    });
  }
})
