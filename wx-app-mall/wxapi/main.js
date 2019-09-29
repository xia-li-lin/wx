/**
 * 小程序开发api接口工具包:
 * https://github.com/gooking/apifm-wxapi 
 * https://api.it120.cc/doc.html
 */
const CONFIG = require('./config.js')
const API_BASE_URL = 'https://api.it120.cc';

const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(success) {
        resolve(success.data)
      },
      fail(error) {
        reject(error)
      },
      complete(complete) {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function(callback) {
  var Promise = this.constructor;
  return this.then(
    function(value) {
      Promise.resolve(callback()).then(
        function() {
          return value;
        }
      );
    },
    function(reason) {
      Promise.resolve(callback()).then(
        function() {
          return reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  // Banner列表
  banners: (data) => {
    return request('/banner/list', true, 'get', data)
  },
  // 存储小程序模板消息的formid数据
  addTempleMsgFormid: (data) => {
    return request('/template-msg/wxa/formId', true, 'post', data)
  },
  // 获取公告列表
  getNotice: (data) => {
    return request('/notice/list', true, 'post', data)
  },
  // 商城模块---商品类别
  getGoodsCategory: (data) => {
    return request('/shop/goods/category/all', true, 'get', data)
  },
  // 获取商品列表
  getGoodsList: (data) => {
    return request('/shop/goods/list', true, 'post', data)
  },
  // 获取商品详情
  getGoodDetail: (data) => {
    return request('/shop/goods/detail', true, 'get', data)
  },
  // 获取砍价设置
  getBargainSet: (data) => {
    return request('/shop/goods/kanjia/set', true, 'get', data)
  },
  // 获取视频素材详情
  getVideoDetail: (data) => {
    return request('/media/video/detail', true, 'get', data)
  },
  // 检测登录token是否有效
  checkLoginToken: (data) => {
    return request('/user/check-token', true, 'get', data)
  },
  // 登录获取Token
  login: (code) => {
    return request('/user/wxapp/login', true, 'post', {
      code: code,
      type: 2
    })
  },
  // 用户注册
  register: (data) => {
    return request('/user/wxapp/register/complex', true, 'post', data)
  },
  // 查看用户资产
  getUserAmount: (token) => {
    return request('/user/amount', true, 'get', {
      token: token
    })
  },
  // 小程序分享到微信群赠送积分
  shareGroupGetScore: (referrer, encryptedData, iv) => {
    return request('/score/share/wxa/group', true, 'post', {
      referrer,
      encryptedData,
      iv
    })
  },
  // 获取当前商户vip级别
  getVipLevel: () => {
    return request('/config/vipLevel', true, 'get')
  }
}