const WXAPI = require('../wxapi/main')

// 检查登录状态
async function checkLoginStatus() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  wx.checkSession({
    fail() {
      return false
    }
  })
  const checkLoginToken = await WXAPI.checkLoginToken({
    token: token
  })
  if (checkLoginToken.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

// 登录
async function login(page) {
  const _this = this
  wx.login({
    success: function (res) {
      WXAPI.login(res.code).then((res) => {
        if (res.code == 10000) {
          // 去注册
          _this.register(page)
          return;
        }
        if (res.code != 0) {
          wx.showModal({
            title: '登录错误',
            content: '无法登录，请重试：' + res.msg,
            showCancel: false
          })
          return
        }
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('uid', res.data.uid)
        if (page) {
          page.onShow()
        }
      })
      console.log(res)
    }
  })
}

// 注册
async function register(page) {
  const _this = this
  wx.login({
    success: function (res) {
      console.log(res)
      const code = res.code
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          let iv = res.iv // 加密偏移数据
          let encryptedData = res.encryptedData // 加密用户信息
          let referrer = '' // 推荐人
          let referrer_storge = wx.getStorageSync('referrer')
          if (referrer_storge) {
            referrer = referrer_storge
          }
          WXAPI.register({
            code: code,
            iv: iv,
            encryptedData: encryptedData,
            referrer: referrer
          }).then((res) => {
            _this.login(page)
          })
        }
      })
    }
  })
}

// 退出
function loginOut() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
  wx.removeStorageSync('userInfo')
}

module.exports = {
  checkLoginStatus: checkLoginStatus,
  login: login,
  register: register,
  loginOut: loginOut
}