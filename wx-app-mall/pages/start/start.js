// pages/start/start.js
const WXAPI = require('../../wxapi/main.js')
const CONFIG = require('../../config.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: '商城'
    })

    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      WXAPI.banners({
        type: 'app'
      }).then(function(res) {
        console.log(res);
        if (res.code == 700) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          _this.setData({
            banners: res.data,
            swiperMaxNumber: res.data.length
          })
        }
      }).catch(function(e) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  swiperchange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })

    if (e.detail.current === this.swiperMaxNumber) {
      this.goToIndex();
    }
  },

  // 进入店铺
  goToIndex: function(e) {
    console.log(e);
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    console.log(e);
    if (app.globalData.isConnected) {
      console.log(111);
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none'
      })
    }
  }
})