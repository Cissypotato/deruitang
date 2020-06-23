// pages/personal/myVip/myVip.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let vip_state= wx.getStorageSync('vip_state')
        let user_id= wx.getStorageSync('token')
        wx.login({ //获得code
            success: res => {
               this.setData({
                  code: res.code,
                  vip_state,
                  user_id
               })
            }
         })
      

       if(vip_state==0){
           wx.redirectTo({
             url: '/pages/index/vip/vip',
            
           })
       }else{
           this.getVip(user_id)
       }
    },
    onShow: function () {

    },
    getVip(id) { //获取vip信息
        wx.request({
           url: 'https://ljjz.guaishe.com/index.php/index/login/viptime',
           data: {
              user_id:id
           },
           success: res => {
              console.log(res.data.data, 1)
              this.time(res.data.data.vip_create_time * 1000)
              this.times(res.data.data.vip_time * 1000) //结束时间
              this.setData({
                 data: res.data.data
              })
           }
        })
     },
     time(data) {
        let tomorrow = new Date(data);
        let year = tomorrow.getFullYear(); //获取年
        let month = tomorrow.getMonth() + 1; //获取月
        let date = tomorrow.getDate(); //获取日
        let tomorrowSS = year + '-' + this.conver(month) + "-" + this.conver(date) //结束时间
        // let tomorrowSS = year - 1 + '-' + this.conver(month) + "-" + this.conver(date)   //购买时间
        this.setData({
           tomorrowSS,
        })
     },
     times(data) {
        let tomorrow = new Date(data);
        let year = tomorrow.getFullYear(); //获取年
        let month = tomorrow.getMonth() + 1; //获取月
        let date = tomorrow.getDate(); //获取日
        let tomorrowS = year + '-' + this.conver(month) + "-" + this.conver(date) //结束时间
        // let tomorrowSS = year - 1 + '-' + this.conver(month) + "-" + this.conver(date)   //购买时间
        this.setData({
           tomorrowS
        })
     },
    //日期时间处理
    conver(s) {
        return s < 10 ? '0' + s : s;
     },
     renew() {
        wx.showModal({
           title: '提示',
           content: '是否续费一年会员',
           success: res => {
              if (res.confirm) {
                 wx.request({
                    url: 'https://ljjz.guaishe.com/index.php/index/pay/renew',
                    data: {
                       user_id: this.data.user_id,
                       code: this.data.code
                    },
                    success: res => {
                       console.log(res)
                       wx.requestPayment({ //支付费用
                          timeStamp: res.data.timeStamp,
                          nonceStr: res.data.nonceStr,
                          package: res.data.package,
                          signType: res.data.signType,
                          paySign: res.data.paySign,
                          user_id: this.data.user_id,
                          success: (res) => {
                             this.getVip()
                             console.log(res, '支付成功')
                          },
                          fail(res) {}
                       })
                    }
                 })
              } else if (res.cancel) {
                 console.log('用户点击取消')
              }
           }
        })
     },
})