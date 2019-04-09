var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

var app = getApp();

Page({
  data: {

    items: [
      { name: '今日打卡', value: '今日打卡', checked: 'true' },
      { name: '本月精选', value: '本月精选' },
      { name: '习字之星', value: '习字之星' },
    ],

    tabs: ["今日打卡", "本月精选", '习字之星'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    show1:true,
    show2:false,
    show3:false,

    imgUrls: [
      'http://118.24.27.43/static/dosjh/images/cxy1.png',
      'http://118.24.27.43/static/dosjh/images/cxy2.png',
      'http://118.24.27.43/static/dosjh/images/cxy3.png',
      'http://118.24.27.43/static/dosjh/images/cxy4.png',
      'http://118.24.27.43/static/dosjh/images/cxy5.png',
      'http://118.24.27.43/static/dosjh/images/cxy6.png',

    ],
    indicatorDots: true,
    autoplay: true,
    interval: 6000,
    duration: 1000,
  },

  onShow: function () {
    var that = this;

    wx.request({
      url: 'http://127.0.0.1:8000/mywork/',
      // data: {
      //   cid: app.globalData.cid,
      // },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        that.setData({
          worklist: res.data,
        })
      }
    })



    // 选项卡初始化
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  // 自动轮播
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  remark:function(e){
    wx.navigateTo({
      url: '../remark/remark',
    })
  },


  tabClick: function (e) {
    if (e.currentTarget.id == 0) {
      this.setData({
        show1: true,
        show2: false,
        show3: false,
      });
    }

    if (e.currentTarget.id == 1) {
      this.setData({
        show1: false,
        show2: true,
        show3: false,
      });
    }

    if (e.currentTarget.id == 2) {
      this.setData({
        show1: false,
        show2: false,
        show3: true,
      });
    }

    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    });

    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onShow()
    }
    else if (res.cancel) {
      // console.log('用户点击取消')
    }
  },

})
