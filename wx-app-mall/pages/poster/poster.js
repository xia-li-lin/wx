// pages/poster/poster.js
const WXAPI = require('../../wxapi/main')
import imageUtil from '../../utils/image'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasStyle: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.goodId = options.goodId
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    wx.showLoading({
      mask: true,
      title: '合成中...',
    })

    const goodsDetail = await WXAPI.getGoodDetail({
      id: this.data.goodId
    })
    const data = goodsDetail.data;
    const basicInfo = data && data.basicInfo
    this.data.pic = basicInfo && basicInfo.pic
    this.data.name = basicInfo && basicInfo.name
    this.downLoadGoodsPic()
    console.log(goodsDetail)

  },

  downLoadGoodsPic:function(){
    const _this=this
    wx.getImageInfo({
      src: _this.data.pic,
      success:(res)=>{
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 保存到手机
  saveToMobile: function () {

  }
})