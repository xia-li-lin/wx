// pages/good-detail/good-detail.js
const WxParse = require('../../assets/wxParse/wxParse.js')
const WXAPI = require('../../wxapi/main.js')
const SelectSizePrefix = '选择：';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperConfig: {
      indicatorDots: false,
      indicatorColor: 'rgba(255,255,255,.4)',
      indicatorActiveColor: 'rgba(255,255,255,1)',
      autoplay: false,
      interval: 3000,
      duration: 1000,
      circular: true
    },
    hasMoreSelect: false,
    selectSize: SelectSizePrefix,
    selectSizePrice: 0,
    totalScoreToPay: 0,
    goodsDetail: {},
    shareoff: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.goodId = options.id

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoodDetail(this.data.goodId)
    this.getBargainSet(this.data.goodId)
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
    const basicInfo = this.data.goodsDetail.basicInfo;
    let _data = {
      title: basicInfo && basicInfo.name,
      path: '/pages/good-detail/good-detail?id=' + basicInfo.id + '&inviter_id' + wx.getStorageSync('uid'),
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.error(err)
      }
    }
    return _data;
  },

  // 获取商品详情信息
  async getGoodDetail(goodId) {
    const _this = this
    const goodDetail = await WXAPI.getGoodDetail({
      id: goodId
    })
    if (goodDetail.code == 0) {
      const data = goodDetail.data;
      const basicInfo = data && data.basicInfo;
      const properties = data && data.properties;
      const picsLen = data && data.pics && data.pics.length;
      let selectSizeTemp = SelectSizePrefix
      if (properties) {
        properties.forEach((item, index) => {
          selectSizeTemp += ' ' + item.name
        })
      }

      _this.setData({
        hasMoreSelect: true,
        selectSize: selectSizeTemp,
        selectSizePrice: basicInfo && basicInfo.minPrice,
        totalScoreToPay: basicInfo && basicInfo.minScore,
        goodsDetail: data
      })

      if (basicInfo && basicInfo.videoId) {
        _this.getVideoUrl(basicInfo.videoId)
      }
      WxParse.wxParse('article', 'html', data.content, _this, 5);
      console.log(data)
    }
  },

  // 获取砍价设置
  async getBargainSet(goodId) {
    const _this = this
    const bargainSet = await WXAPI.getBargainSet({
      goodsId: goodId
    })
    // console.log(bargainSet)
  },

  // 获取视频地址
  getVideoUrl: function (videoId) {
    const _this = this;
    WXAPI.getVideoDetail(videoId).then((res) => {
      if (res.code == 0) {
        _this.setData({
          videoMp4Src: res.data.fdMp4
        })
      }
    })
  },

  // 轮播图焦点发生变化时
  handleSwiperChange: function (e) {

  },

  // 打开分享窗口
  handleOpenShareWin: function () {
    this.setData({
      shareoff: true
    })
  },

  // 生成海报
  handleGeneratePoster: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/poster/poster?goodId=' + e.currentTarget.dataset.goodid,
    })
  },

  // 取消分享
  handleCloseShareMask: function () {
    this.setData({
      shareoff: false
    })
  }

})