// pages/personal/card/addCard/addCard.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      input_data: {},
      showSecond: false,
      second: 60
    },
  
    onLoad: function (options) {
      let user_id = wx.getStorageSync("token")
      this.setData({
        user_id
      })
  
    },
    getInputValue(e) {
      let value = e.detail.value
  
      this.setData({
        tel: value
      })
  
    },
    getInputCertify(e) {
      let value = e.detail.value
      // console.log(value)
      // console.log(this.data.info)
      if (value) {
        if (Number(value) === Number(this.data.info)) {
          this.setData({
            certify_num: value
          })
        } else {
          app.alert("验证码不匹配，请重新填写")
        }
      }
  
    },
  
    getCertifyNum() {//获取验证码
      let telreg = /^1[3|4|5|8][0-9]\d{4,8}$/
      console.log(this.data.tel)
      let second = this.data.second
      if (!telreg.test(this.data.tel)) {
        app.alert("请输入正确的电话号码")
      } else {
        this.setData({
          showSecond: true
        })
        let interval = setInterval(() => {
          this.setData({
            second: second--
          })
  
          if (second <= 0) {
            clearInterval(interval)
            this.setData({
              // time: '重新获取',
              second: 60,
              // disabled: false,
              showSecond: false
  
            })
          }
        }, 1000)
        wx.request({
          url: appUrl + '/index.php/index/sms/sms',
          data: {
            tel: this.data.tel
          },
          success: (res) => {
            console.log(res.data.info)
            this.setData({
              info: res.data.info
            })
  
  
          },
        })
      }
  
    },
    // getCode: function (options) {
    //     var that = this;
    //     var currentTime = that.data.currentTime;
    //     that.setData({
    //         time: currentTime + '秒'
    //     })
    //     let interval = setInterval(function () {
    //         that.setData({
    //             time: (currentTime - 1) + '秒'
    //         })
    //         currentTime--;
    //         if (currentTime <= 0) {
    //             clearInterval(interval)
    //             that.setData({
    //                 time: '重新获取',
    //                 currentTime: 60,
    //                 disabled: false
    //             })
    //         }
    //     }, 1000)
    // },
  
    certifySubmit(e) { //实名认证表单提交
      console.log(1)
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      // let phoneReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
      let nameReg = /^[\u4E00-\u9FA5]{2,4}$/
      let upData = e.detail.value
      // if (!nameReg.test(upData.name)) {
      //     wx.showToast({
      //         title: "请填写真实姓名",
      //         icon: 'none',
      //         duration: 2000,
      //     })
      // } else if (!regIdNo.test(upData.id_card)) {
      //     wx.showToast({
      //         title: "请填写有效身份证号码",
      //         icon: 'none',
      //         duration: 2000,
      //     })
      // } else 
      if (!this.data.tel) {
        app.alert("请填写手机号码")
      } else if (Number(this.data.info) !== Number(this.data.certify_num)) {
        app.alert("验证码不配，请重新填写")
      } else {
        console.log(upData)
        wx.request({
          url: appUrl + "/index/user/real_name",
          data: {
            name: upData.name,
            card: upData.id_card,
            id: this.data.user_id,
            phone: this.data.tel
          },
          success: (res) => {
            console.log(res)
            if (res.data.state == false) {
              wx.showToast({
                title: res.data.info + ",请重新填写",
                icon: 'none',
                duration: 2000,
              })
            } else if (res.data.state == true) {
              wx.setStorageSync("user_real", 1)
              wx.navigateBack({
                delta: 1,
                success: (res) => {
                  wx.showToast({
                    title: "实名认证成功",
                    icon: 'none',
                    duration: 2000,
                  })
                }
              })
  
            }
          },
        })
      }
  
    },
    toLogin() {
      wx.navigateTo({
        url: '../../index/login/login'
      })
    }
  })