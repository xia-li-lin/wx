// pages/category/category.js

const WXAPI = require('../../wxapi/main.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryToView: '', // 左侧分类，设置哪个方向可滚动，则在哪个方向滚动到该元素
    goodsToView: '',
    categories: [],
    goodsList: [],
    currentCategoryId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    this.getGoodsCategory()
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

  // 获取商品分类
  getGoodsCategory: function() {
    const _this = this;
    WXAPI.getGoodsCategory().then((res) => {
      const data = res && res.data;
      _this.converCategories(data, _this)
    }).catch((e) => {
      wx.hideNavigationBarLoading()
    })
  },

  // 对商品分类进行数据转换
  converCategories: function(data, _this) {
    const categories = []
    data.forEach((value, index) => {
      value.scrollId = "scroll" + value.id
      categories.push(value)
      if (index === 0) {
        _this.setData({
          currentCategoryId: value.scrollId,
          goodsToView: value.scrollId
        })
      }
    })
    _this.setData({
      categories: categories
    })
    this.getGoodsList()
  },

  // 点击分类显示商品信息
  handleCategoryClick: function(e) {
    const id = e.currentTarget.id
    this.categoryClick = true;
    this.setData({
      currentCategoryId: id,
      goodsToView: id
    })
  },

  // 获取商品信息
  getGoodsList: function() {
    const _this = this;
    WXAPI.getGoodsList({
      categoryId: '',
      page: 1,
      pageSize: 100000
    }).then((res) => {
      const data = res && res.data
      const goodsList = []
      _this.data.categories.forEach((value, index) => {
        let temp = {}
        let goods = []
        temp.id = value.id
        temp.scrollId = 'scroll' + value.id
        temp.name = value.name
        temp.goods = goods

        data.forEach((item) => {
          if (item.categoryId == temp.id) {
            goods.push(item)
          }
        })

        goodsList.push(temp)
      })
      _this.setData({
        goodsList: goodsList
      })
      wx.hideNavigationBarLoading()
    }).catch((e) => {
      wx.hideNavigationBarLoading()
    })
  },

  // 点击进入商品详情
  handleGoodDetail: function(e) {

  },

  // 滚动时触发   注：最后回来实现此功能
  handleScroll: function(e) {
    if (this.categoryClick) {
      this.categoryClick = false;
      return;
    }
    console.log(e);
    let offset = 0;
    let isBreak = false;
    let scrollTop = e.detail.scrollTop;
    this.data.goodsList.forEach((value, index) => {
      offset += 30;
      if (scrollTop <= offset) {
        if (this.data.categoryToView != value.scrollId) {
          this.setData({
            currentCategoryId: value.scrollId,
            categoryToView: value.scrollId
          })
        }
      }
    })
  }

})