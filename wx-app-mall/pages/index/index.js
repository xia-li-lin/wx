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
    goodsPintuan: [],
    page: 1,
    pageSize: 20,
    categoryScrollLeft: 0,
    loadingMoreHidden: true,
    goodsName: ''
  },
  onLoad: function () {
    this.getNotice();
    this.getGoodsCategory();
    this.getBanners();
    this.getGoodsRecommend();
    this.getGoodsPintuan();
    this.getGoodsList(0)
  },
  // 获取公共列表
  getNotice: function () {
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
  getGoodsCategory: function () {
    const _this = this;
    WXAPI.getGoodsCategory().then((res) => {
      const data = res && res.data;
      this.setData({
        categories: data
      })
    })
  },
  // 点击商品分类
  handleCategoryClick: function (e) {
    let offset = e.currentTarget.offsetLeft;
    if (offset > 150) {
      offset = offset - 150;
    } else {
      offset = 0;
    }
    this.setData({
      categoryActive: e.currentTarget.id,
      goodsName: e.currentTarget.dataset.item.name,
      page: 1,
      categoryScrollLeft: offset
    })
    this.getGoodsList(this.data.categoryActive)
  },
  // 获取banner图
  getBanners: function () {
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
  getGoodsRecommend: function () {
    const _this = this;
    WXAPI.getGoodsList({
      recommendStatus: 1
    }).then((res) => {
      _this.setData({
        goodsRecommed: res && res.data
      })
    })
  },
  // 全民拼团
  getGoodsPintuan: function () {
    const _this = this;
    WXAPI.getGoodsList({
      pingtuan: true
    }).then((res) => {
      _this.setData({
        goodsPintuan: res && res.data
      })
    })
  },
  // 获取商品列表
  getGoodsList: function (categoryId, append) {
    const _this = this;
    if (!categoryId) {
      categoryId = '';
    }

    wx.showLoading({
      'mask': true
    })
    WXAPI.getGoodsList({
      categoryId: categoryId,
      nameLike: _this.data.inputVal,
      page: _this.data.page,
      pageSize: _this.data.pageSize
    }).then((res) => {
      wx.hideLoading()
      const data = res && res.data;
      if (res.code == 404 || res.code == 700) {
        let newData = {
          loadingMoreHidden: false
        }
        if (!append) {
          newData.goods = []
        }
        _this.setData(newData)
        return
      }
      let goods = []
      if (append) {
        goods = _this.data.goods
      }
      for (let i = 0; i < data.length; i++) {
        goods.push(data[i])
      }
      _this.setData({
        loadingMoreHidden: true,
        goods: goods
      })
    })
  },
  // 搜索
  handleSearchClick: function () {
    this.setData({
      page: 1
    })
    this.getGoodsList(this.data.categoryActive)
  },
  // 监听用户下拉动作
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.getGoodsList(this.data.categoryActive)
    wx.stopPullDownRefresh()
  },
  // 页面上拉触底事件
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })

    this.getGoodsList(this.data.categoryActive, true)
  },
  // 点击跳转到商品详情
  handleGoodDetailClick: function (e) {
    const id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/good-detail/good-detail?id='+id,
    })
  },
  // 以下为搜索框事件
  showInput: function () {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function () {
    this.setData({
      inputShowed: false
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: ''
    })
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
})