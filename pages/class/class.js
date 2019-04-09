var app = getApp();

Page({
  data: {
    inputShowed: false,
    inputVal: "",

    MemberList: [],
  },

  isOpen: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.index;
    var memberList = that.data.MemberList;
    for (let i = 0; i < memberList.length; i++) {
      if (idx == i) {
        memberList[i].hidden = !memberList[i].hidden;
      } else {
        memberList[i].hidden = true;
      }
    }
    this.setData({ MemberList: memberList });
    return true;
  },

  onShow: function () {

    if (app.globalData.sid == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }

    var that = this
    wx.request({
      url: 'http://127.0.0.1:8000/course/',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        that.setData({
          MemberList: res.data,
        }) 
      }
    })
  },

  onShareAppMessage: function () {

  },

  video: function(e){

      app.globalData.cid = e.currentTarget.id
      app.globalData.CS_id = e.currentTarget.dataset.csid
      app.globalData.C_id = e.currentTarget.dataset.c_id
    console.log(app.globalData.C_id)

      wx.request({
        url: 'http://127.0.0.1:8000/ifbuy',
        data: {
          sid: app.globalData.sid,
          cid: app.globalData.cid,
          CS_id: app.globalData.CS_id,
        },
        success: function (res) {
          
          app.globalData.cUrl = res.data;

          if (app.globalData.cUrl !== '') {
            wx.navigateTo({
              url: '../video/video',
            })
          }else{
            console.log('未购买')
            wx.switchTab({
              url: '../buy/buy',
            })
          }
        }
      })
    
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });

    var that = this
    wx.request({
      url: 'http://127.0.0.1:8000/course/',
      data: {
        search: e.detail.value
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          MemberList: res.data,
        })
      }
    })
  },

  search: function (e) {
    var that = this;
    that.setData({
      title: e.currentTarget.id,
      type: '',
      inputVal: "",
      hidetabs: true,
    })
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onShow()
    }
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
    });
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onShow()
    }
  },



})