var app = getApp();

Page({
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },



  bindGetUserInfo: function (e) {
    var nickName = e.detail.userInfo.nickName //用户名
    var avatarUrl = e.detail.userInfo.avatarUrl //头像链接
    app.globalData.nickName = nickName
    app.globalData.avatarUrl = avatarUrl

    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'http://127.0.0.1:8000/login',
            data:{
              code:res.code,
              nickName: nickName,
              avatarUrl: avatarUrl,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              app.globalData.sid = res.data.sid;
              app.globalData.userInfo = res.data;
              console.log('当前登录的用户id是' + app.globalData.userInfo.S_id + '，学号是' + app.globalData.userInfo.sid + '，角色是' + app.globalData.userInfo.role)  
            }
          });
        }
      }
    });

    wx.navigateBack();
  },

})