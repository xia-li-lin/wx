//app.js
App({
  onLaunch: function () {
    // 检测新版本
    const _this=this;
    const updateManager=wx.getUpdateManager();
    updateManager.onUpdateReady(()=>{
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res){
          if(res.confirm){
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
        const networkType=res.networkType;
        if(networkType==='none'){
          _this.globalData.isConnected=false;
          wx.showToast({
            title: '当前无网络',
            icon:'loading',
            duration:2000
          })
        }
      }
    });

    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
    */
    wx.onNetworkStatusChange(function(res){
      if (!res.isConnected){
        _this.globalData.isConnected=false;
        wx.showToast({
          title: '网络已断开',
          icon:'loading',
          duration:2000,
          complete:function(){
            _this.goToStartPage();
          }
        })
      }else{
        _this.globalData.isConnected=true;
        wx.hideToast();
      }
    })

  },
  goToStartPage:function(){
    setTimeout(()=>{
      wx.redirectTo({
        url: '/pages/start/start',
      })
    },1000)
  },
  globalData: {
    userInfo: null,
    isConnected:true
  }
})