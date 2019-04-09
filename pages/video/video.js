const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var app = getApp();

Page({
  data: {
    role: '',
    cUrl: '',
    sid:'',

    show: false,
    showcommentform: false,
    vshow: true,
    img: [],
    toView: '',

    recorderTempFilePath: '', // 录音地址
    playDuration: '', // 播放时间
    onPlay: false, // 播放状态样式判断
    voice: false, // 预览语音显示
  },

  // 删除作业
  delwork: function (e) {
    var wid = e.target.id;
    wx.showModal({
      title: '楚小月友情提示您：',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'http://127.0.0.1:8000/actmywork',
            method: 'GET',
            data: {
              action:'del',
              wid: wid,
            },
          })
          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onShow()
          }
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  onShow: function(e) {
    var that = this
    that.setData({
      cUrl: app.globalData.cUrl,
      role:app.globalData.userInfo.role,
      sid: app.globalData.sid,
    })

    wx.request({
      url: 'http://127.0.0.1:8000/mywork/',
      data:{
        cid_id:app.globalData.C_id,
      },
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
  },

  // 交作业
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
    var that =this
    that.setData({
      vshow: false,
    })
  },

  // 保存按钮
  submitwork: function(e) {
    var that = this;
    // 获取表单的值
    var remark = e.detail.value.remark;

    wx.uploadFile({
      url: 'http://127.0.0.1:8000/actmywork', 
      filePath: that.data.img[0],
      name: 'img',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      formData: {
        sid: app.globalData.sid,
        c_id: app.globalData.C_id,
        remark: remark,
        action:'add',
      },
      success: function(res) {
        console.log('保存成功！')
      }
    })

    that.setData({
      show: false,
      vshow: true,
    })

    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onShow()
    }

    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  // 按住录音
  recorderS: function() {
    const options = {
      duration: 600000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    // 开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log(开始录音);
      // wx.showLoading({
      //   title: '录音中...',
      // })
    })
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
      // wx.hideLoading();
      wx.showToast({
        // title: res,
        icon: 'success',
        duration: 1000
      })
    })
  },
  // 录音结束
  recorderE: function() {
    let that = this;
    // 结束录音
    recorderManager.stop();
    recorderManager.onStop((res) => {
      // wx.hideLoading();
      wx.showToast({
        title: '录音结束',
        icon: 'success',
        duration: 1000
      })
      const {
        tempFilePath,
        duration
      } = res
      let recorderTempFilePath = tempFilePath;
      let playDuration = Math.ceil(duration / 1000);
      that.setData({
        recorderTempFilePath: recorderTempFilePath,
        playDuration: playDuration,
        voice: true
      })
    })
  },
  // 播放录音
  play: function() {
    let that = this;
    let recorderTempFilePath = that.data.recorderTempFilePath;
    innerAudioContext.autoplay = true
    innerAudioContext.src = recorderTempFilePath
    innerAudioContext.onPlay(() => {
      that.setData({
        onPlay: true
      })
    })
    innerAudioContext.onError((res) => {
      wx.showToast({
        title: res.errMsg,
        icon: 'success',
        duration: 2000
      })
    })
    // 播放结束
    innerAudioContext.onEnded((res) => {
      that.setData({
        onPlay: false
      })
    })
  },

  hideform: function(e) {
    
    this.setData({
      show: false,
      vshow: true,
    })
  },

  // showcommentform: function (e) {
  //   this.setData({
  //     showcommentform: true,
  //   })
  //   setTimeout(function () {
  //     var currentY = e.touches[0].pageY
  //     wx.pageScrollTo({
  //       scrollTop: currentY+300
  //     })
  //   }, 100) //延迟时间 1000为1秒
  // },

  hidecommentform: function(e) {
    this.setData({
      showcommentform: false,
      showvideo: true,
    })
  },

  // 作业表单动画
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例  
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function() {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData({
          show: false,
          showvideo: true,
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        show: true,
        showvideo: false,
      });
    }
  },

  // 点评按钮
  powerDrawer2: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util2(currentStatu)
  },

  /* 点评表单动画 */
  util2: function(currentStatu) {

    // 第1步：创建动画实例  
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function() {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData({
          showcommentform: false,
          showvideo: true,
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        showcommentform: true,
        showvideo: false,
      });
    }
  },

  // 删除图片
  deleteImg: function(e) {
    var imgs = this.data.img;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      img: imgs
    });
  },

  chooseImage: function(e) {
    var that = this,
      img = that.data.img;

    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //可以指定来源相册还是相机，默认二者都有
      success: function(res) {
        if (res.tempFiles.length + img.length <= 1) {
          for (var i = 0; i < res.tempFiles.length; i++) {
            var tempFilesSize = res.tempFiles[i].size; //获取图片的大小，单位B
            if (tempFilesSize <= 2000000) { //图片小于或者等于2M时 可以执行获取图片
              var tempFilePaths = res.tempFilePaths[i]; //获取图片
              that.data.img.push(tempFilePaths); //添加到数组
              that.setData({
                img: that.data.img
              })
            } else { //图片大于2M，弹出一个提示框
              wx.showToast({
                title: '上传图片不能大于2M!', //标题
                icon: 'none' //图标 none不使用图标，详情看官方文档
              })
            }
          }
        } else { //大于三张时直接弹出一个提示框
          wx.showToast({
            title: '一张照片就好了哦！！',
            icon: 'none'
          })
        }
      }
    })
  },

  // 显示图片
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.img // 需要预览的图片http链接列表
    })
  },

  onShareAppMessage: function() {
    var that = this;
    return {
      title: '楚小月书法课堂',
      path: 'pages/video/video',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }

})