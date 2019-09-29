//app.js
const WXAPI=require('./wxapi/main')

App({
  onLaunch: function () {
    // 检测新版本
    const _this = this;
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
    */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (networkType === 'none') {
          _this.globalData.isConnected = false;
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });

    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
    */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        _this.globalData.isConnected = false;
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            _this.goToStartPage();
          }
        })
      } else {
        _this.globalData.isConnected = true;
        wx.hideToast();
      }
    }),

    this.getVipLevel()

  },
  onShow(e) {
    this.globalData.launchOption = e
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      // 通过分享链接进来
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            WXAPI.shareGroupGetScore(
              e.query.inviter_id,
              res.encryptedData,
              res.iv
            )
          }
        })
      }
    }
    console.log(e)
  },
  goToStartPage: function () {
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/start/start',
      })
    }, 1000)
  },
  getVipLevel:function(){
    const _this=this
    WXAPI.getVipLevel().then((res)=>{
      console.log(res.data)
      _this.globalData.vipLevel = res.data
    })
  },
  globalData: {
    launchOption: undefined,
    isConnected: true,
    vipLevel: 0
  }
})