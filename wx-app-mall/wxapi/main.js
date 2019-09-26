// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('./config.js')
const API_BASE_URL = 'https://api.it120.cc';

const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
  console.log(_url);
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
Promise.prototype.finally = function (callback) {
  var Promise=this.constructor;
  return this.then(
    function(value){
      Promise.resolve(callback()).then(
        function(){
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
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
  addTempleMsgFormid:(data)=>{
    return request('/template-msg/wxa/formId',true,'post',data)
  },
  // 获取公告列表
  getNotice:(data)=>{
    return request('/notice/list',true,'post',data)
  }
}

