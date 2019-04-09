// pages/call/call.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/imgs/1.jpg',
      '/imgs/2.jpg',
      '/imgs/4.png',
      '/imgs/5.png',
      '/imgs/6.png',
      '/imgs/7.png',
      '/imgs/8.png',
      '/imgs/9.png',
      '/imgs/10.png',
      '/imgs/11.png',
      '/imgs/12.png',
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  call: function() {
    wx.makePhoneCall({
      phoneNumber: '19950153568'
    })
  },

  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})