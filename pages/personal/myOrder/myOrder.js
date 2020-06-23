// pages/personal/order/order.js
const app = getApp()
let appUrl = app.globalData.url
Page({
   data: {
      isArr1: true,
      isArr2: false,
      isArr3: false,
      isAddMoney: false,
      isChangeDate: false,
      date: '2020-04-21',
      order_data: {
         num: 1
      }
   },
   onLoad: function(options) {
      this.getUser_id()
      wx.login({ //获得code
         success: res => {
            this.setData({
               code: res.code
            })
         }
      })
   },
   onShow: function() {
      this.getUser_id()
      this.getInitData()
     
   },
   getUser_id() { //获取用户id
      let user_id = wx.getStorageSync("token")
      this.setData({
         user_id
      })
   },
   getVip() { //获取vip信息
      wx.request({
         url: 'https://ljjz.guaishe.com/index.php/index/login/viptime',
         data: {
            user_id: this.data.user_id
            // user_id: 7
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
   getDate(timetamp) {
      let today = new Date()
      let tomorrowT = today.getTime() + 1000 * 60 * 60 * 24 * 1
      let tomorrow = new Date(tomorrowT);
      let year = tomorrow.getFullYear(); //获取年
      let month = tomorrow.getMonth() + 1; //获取月
      let date = tomorrow.getDate(); //获取日
      let tomorrowS = year + '-' + this.conver(month) + "-" + this.conver(date)

      let future7T = today.getTime() + 1000 * 60 * 60 * 24 * 7 //未来第七天的时间戳
      let future7 = new Date(future7T);
      let year7 = future7.getFullYear(); //获取年
      let month7 = future7.getMonth() + 1; //获取月
      let date7 = future7.getDate(); //获取日
      let future7S = year7 + '-' + this.conver(month7) + "-" + this.conver(date7)

      this.setData({
         date: tomorrowS,
         tomorrowS,
         future7S
      })
   },

   //日期时间处理
   conver(s) {
      return s < 10 ? '0' + s : s;
   },

   getInitData() {
      let user_id = wx.getStorageSync("token")
      wx.request({
         url: 'https://ljjz.guaishe.com/index.php/index/login/returnOrder',
         data: {
            user_id
         },
         success: (res) => {
            let arr1 = res.data //全部
            let arr2 = [] //待服务
            let arr3 = [] //已完成
            for (let i = 0; i < arr1.length; i++) {
               if (arr1[i].status == 1) {
                  arr2.push(arr1[i])
               } else if (arr1[i].status == 2) {
                  arr3.push(arr1[i])
               }
            }
            this.setData({
               arr1,
               arr2,
               arr3
            })
         },
      })
   },
   changeArr(e) {
      let arr = e.currentTarget.dataset.arr
      if (arr == 1) {
         this.setData({
            isArr1: true,
            isArr2: false,
            isArr3: false,
         })
      } else if (arr == 2) {
         this.setData({
            isArr1: false,
            isArr2: true,
            isArr3: false,
         })
      } else if (arr == 3) {
         this.setData({
            isArr1: false,
            isArr2: false,
            isArr3: true,
         })
      }

   },
   changeDate(e) {
      let order_id = e.currentTarget.dataset.id
      wx.request({
         url: 'https://ljjz.guaishe.com/sxq/demo.php?fa=starttime',
         data: {
            id: order_id
         },
         success: (result) => {
            let currentOrderDate = result.data.data
            this.setData({
               currentOrderDate,
               isChangeDate: true,
               order_id
            })
         },
      })
   },
   addMoney(e) { //点击超时加费
      let order_id = e.currentTarget.dataset.id
      wx.request({
         url: 'https://ljjz.guaishe.com/index.php/index/pay/overDesc',
         data: {
            order_id
         },
         success: (result) => {
            let order = result.data.data
            let order_data = this.data.order_data
            order_data.price = order.price
            this.setData({
               order,
               isAddMoney: true,
               order_data,
               order_id
            })
         },
      })
   },
   add() {
      let order_data = this.data.order_data
      order_data.num++
         order_data.price = order_data.num * this.data.order.price
      this.setData({
         order_data
      })
   },
   reduce() {
      let order_data = this.data.order_data
      if (order_data.num <= 1) {
         wx.showToast({
            icon: "none",
            title: '不能再减啦',
         })
      } else {
         order_data.num = order_data.num - 1
         order_data.price = order_data.num * this.data.order.price
         this.setData({
            order_data
         })
      }
   },
   handleCover(e) {
      let type = e.currentTarget.dataset.type
      if (type == "money") {
         let isAddMoney = !this.data.isAddMoney
         this.setData({
            isAddMoney
         })
      } else if (type == "date") {
         let isChangeDate = !this.data.isChangeDate
         this.setData({
            isChangeDate
         })
      }

   },
   blueclick() {
      console.log("阻止冒泡")
   },

   move() {
      console.log('move')
   },
   confirm() { //确认支付
      let user_id = this.data.user_id
      let order_id = this.data.order_id
      wx.request({
         url: 'https://ljjz.guaishe.com/index.php/index/pay/overTime?=4&=8&num=2',
         data: {
            order_id,
            user_id,
            num: this.data.order_data.num
         },
         success: (result) => {
            if (result.data.code == 200) {
               let order_id = result.data.order_id
               this.pay(order_id)
            }
         },
      })

   },
   confirmChangeDate() { //确认更改时间
      let currentOrderDate = this.data.currentOrderDate
      let string = currentOrderDate.split(" ")
      let dataDate = this.data.date + ' ' + string[1]
      let order_id = this.data.order_id
      wx.request({
         url: 'https://ljjz.guaishe.com/sxq/demo.php?fa=update&id=%20&date=',
         data: {
            id: order_id,
            date: dataDate
         },
         success: (result) => {
            if (result.data.state == 0) {
               this.setData({
                  isChangeDate: false
               })
               this.getInitData()
               wx.showToast({
                  icon: "none",
                  title: '更改成功',
               }, 800)
            }

         },
      })

   },
   bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
         date: e.detail.value
      })
   },
   pay(id) { //支付
      wx.login({
         complete: (res) => {
            if (res.code) {
               wx.request({
                  url: 'https://ljjz.guaishe.com/index.php/index/pay/payTime',
                  data: {
                     id: id,
                     code: res.code,
                  },
                  success: (res) => {
                     console.log(res)
                     if (res.errMsg == "request:ok") {
                        let data = res.data
                        wx.requestPayment({
                           'timeStamp': data.timeStamp,
                           'nonceStr': data.nonceStr,
                           'package': data.package,
                           'signType': data.signType,
                           'paySign': data.paySign,
                           'success': (res) => {
                              console.log(res)
                              this.setData({
                                 isAddMoney: false
                              })
                              this.getInitData()
                              wx.showToast({
                                 icon: "none",
                                 title: '支付成功',
                              }, 800)
                           },

                        })
                     }

                  }
               })
            }
         },
      })
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
   goVip() {
      wx.navigateTo({
         url: '../vip/vip',
      })
   }
})