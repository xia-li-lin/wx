//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../wxapi/main.js')
const CONFIG = require('../../config.js')

Page({
  data: {
    inputShowed: false, // 搜索框样式切换
    inputVal: '', // 搜索框内容
    noticeList: {}, // 公告
    categories: [], // 商品分类
    categoryActive: 0,
    banners: [], // 获取banner图
    goodsRecommed: [], // 爆款推荐
    goodsPintuan: []
  },
  onLoad: function() {
    this.getNotice();
    this.getGoodsCategory();
    this.getBanners();
    this.getGoodsRecommend();
    this.getGoodsPintuan();
  },
  // 获取公共列表
  getNotice: function() {
    const _this = this;
    WXAPI.getNotice({
      page: 1,
      pageSize: 5
    }).then((res) => {
      _this.setData({
        noticeList: res && res.data
      })
    })
  },
  // 获取商品分类
  getGoodsCategory: function() {
    const _this = this;
    WXAPI.getGoodsCategory().then((res) => {
      this.setData({
        categories: res && res.data
      })
    })
  },
  // 点击商品分类
  handleCategoryClick: function(e) {
    console.log(e);
    this.setData({
      categoryActive: e.currentTarget.id
    })
  },
  // 获取banner图
  getBanners: function() {
    const _this = this;
    WXAPI.banners({
      type: 'new'
    }).then((res) => {
      this.setData({
        banners: res && res.data
      })
    });
  },
  // 爆款推荐
  getGoodsRecommend: function() {
    const _this = this;
    WXAPI.getGoodsList({
      recommendStatus: 1
    }).then((res) => {
      console.log(res);
      _this.setData({
        goodsRecommed: res && res.data
      })
    })
  },
  // 全民拼团
  getGoodsPintuan: function() {
    const _this = this;
    WXAPI.getGoodsList({
      pingtuan: true
    }).then((res) => {
      console.log(res);
      _this.setData({
        goodsPintuan: res && res.data
      })
    })
  },
  // 点击跳转到商品详情
  handleGoodDetailClick: function() {

  },
  // 以下为搜索框事件
  showInput: function() {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function() {
    this.setData({
      inputShowed: false
    })
  },
  clearInput: function() {
    this.setData({
      inputVal: ''
    })
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
})