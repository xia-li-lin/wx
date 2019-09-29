// pages/user/user.js
const AUTH = require('../../utils/auth')
const WXAPI = require('../../wxapi/main')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeOpen: false, // 是否开启充值（预存）功能
    balance: 0.00, // 余额
    freeze: 0, // 冻结
    score: 0, // 积分

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // const rechargeOpen = wx.getStorageSync('RECHARGE_OPEN')
    // if(rechargeOpen && rechargeOpen=='1'){
    //   rechargeOpen=true
    // }else{
    //   rechargeOpen=false
    // }
    // console.log(rechargeOpen)
    // this.setData({
    //   rechargeOpen: rechargeOpen
    // })
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
    const _this = this
    AUTH.checkLoginStatus().then((isLogin) => {
      if (isLogin) {
        _this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })

        _this.getUserAmount()
      }
    })
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

  // 点击登录帐号
  getUserInfo: function(e) {
    console.log(e)
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '您已取消登录',
        icon: 'none'
      })
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      AUTH.login(this)
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none'
      })
    }
  },

  // 点击余额，冻结跳转到
  goToAccountDetail: function() {
    wx.navigateTo({
      url: '/pages/account-detail/account-detail',
    })
  },

  // 跳转到积分页面
  goToIntegral: function() {
    wx.navigateTo({
      url: '/pages/integral/integral',
    })
  },

  // 获取用户的资产
  getUserAmount: function() {
    const _this = this
    const token = wx.getStorageSync('token')
    WXAPI.getUserAmount(token).then((res) => {
      const data = res.data;
      _this.setData({
        balance: data.balance,
        freeze: data.freeze,
        score: data.score,
      })
    })
  },

  // 路由跳转到订单页面
  goToOrderList: function(e) {
    wx.navigateTo({
      url: 'pages/order-list/order-list' + e.currentTarget.dataset.type,
    })
  }
})