// pages/personal/personal.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLogin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getUserState()
    },
    getUserState() {
        let user_id = wx.getStorageSync('userId')
        // let vip_state = wx.getStorageSync('vip_state')
        if (user_id) {
            this.setData({
                user_id
            })
            // this.getInitData(user_id)
            console.log(user_id)
        }
    },
    // getInitData(id) {
    //     wx.request({
    //         url: 'https://ljjz.guaishe.com/index.php/index/api/userInfo?id=' + id,
    //         success: (result) => {
    //             console.log(result)
    //             let user_tel = result.data.info.tel
    //             let show_tel = user_tel.substr(0, 3) + '****' + user_tel.substr(7, 11);
    //             this.setData({
    //                 user_id: id,
    //                 vip_state: result.data.info.vip,
    //                 show_tel
    //             })
    //         },
    //     })
    // },
    // onMyEvent: function (e) {//接收login组件传递过来的值
    //     // e.detail // 自定义组件触发事件时提供的detail对象
    //     console.log(e.detail)
    //     this.getInitData(e.detail.user_id)
    //     // wx.request({
    //     //   url: 'https://ljjz.guaishe.com/index.php/index/api/userInfo?id='+e.detail.user_id,
    //     //   success: (result) => {
    //     //       console.log(result)
    //     //       let user_tel=result.data.info.tel
    //     //       let show_tel=user_tel.substr(0, 3) + '****' + user_tel.substr(7, 11);
    //     //       this.setData({
    //     //         user_id: e.detail.user_id,
    //     //         vip_state: e.detail.vip_state,
    //     //         show_tel
    //     //     })
    //     //   },
    //     // })
    // },
    toLogin() {
       wx.navigateTo({
         url: './login/login',
       })
    },
    toPage(e) {

        if (!this.data.user_id) {
            this.setData({ showLogin: true })
        } else {
            let id = e.currentTarget.dataset.id
            console.log(id)

            if (id == 1) {
                wx.navigateTo({ url: './myOrder/myOrder' })
            }else if (id == 3) {
                wx.navigateTo({ url: './address/address' })
            }else if (id == 5) {
                wx.navigateTo({ url: './certify/certify' })
            }  
           
        }
    }
})