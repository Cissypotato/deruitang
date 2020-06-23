// components/login/login.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showLogin: {
            type: Boolean
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        loginData: {},
        second: 60,
        showSecond: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getInputValue(e) {
            let loginData = this.data.loginData
            let value = e.detail.value
            let name = e.currentTarget.dataset.name
            loginData[name] = value
            // console.log(e)
            this.setData({
                loginData
            });
        },
        getCode() { //获取手机验证码

            let tel = this.data.loginData.tel
            let second = this.data.second
            if (!tel) {
                wx.showToast({
                    title: '请输入电话号码',
                    icon: 'none',
                    duration: 2000,
                })
                // app.alert("请输入电话号码")
            } else if (!(/^1[3456789]\d{9}$/.test(tel))) {
                wx.showToast({
                    title: '请输入正确电话号码',
                    icon: 'none',
                    duration: 2000,
                })
                // app.alert("请输入正确电话号码")
            } else {
                this.setData({
                    showSecond: true
                })
                let interval = setInterval(() => {
                    this.setData({
                        second: second--
                    });
                    if (second <= 0) {
                        clearInterval(interval)
                        this.setData({
                            // time: '重新获取',
                            second: 60,
                            // disabled: false,
                            showSecond: false

                        })
                    }
                }, 1000);
                wx.request({
                    url: 'https://ljjz.guaishe.com/index.php/index/Login/returnCode',
                    data: {
                        tel: tel
                    },
                    success: (res) => {
                        console.log(res)
                        if (res.data.state == true) {
                            this.setData({
                                tel_code: res.data.info,
                                tel_1: res.data.tel
                            })
                        } else {
                            app.alert(res.data.info)
                        }

                    },
                })
            }
        },
        login() { //登录
            let code = this.data.loginData.code
            let tel = this.data.loginData.tel
            let tel_1 = this.data.tel_1
            let server_id = wx.getStorageSync('server_id')
            if (Number(code) !== Number(this.data.tel_code)) {
                wx.showToast({
                    title: '验证码填写错误，请重新填写',
                    icon: 'none',
                    duration: 2000,
                })
                // app.alert("验证码填写错误，请重新填写")
            } else if (tel !== tel_1) {
                wx.showToast({
                    title: '手机号码与验证码不匹配，请重新填写',
                    icon: 'none',
                    duration: 2000,
                })
                // app.alert("手机号码与验证码不匹配，请重新填写")
            } else {
                wx.request({
                    url: 'https://ljjz.guaishe.com/index.php/index/Login/returnId1',
                    data: {
                        tel: this.data.loginData.tel,
                        server_id: server_id ? server_id : 7
                    },
                    success: (res) => {
                        console.log(res)
                        if (res.data.code == 200) {
                            wx.setStorageSync("token", res.data.id)
                            // console.log(res.data.state, "res.data.state")
                            wx.setStorageSync("vip_state", res.data.vip)
                            // if (res.data.vip == 1) {
                            //     this.setData({
                            //         flag: false
                            //     })
                            // }
                            var myEventDetail = {vip_state: res.data.vip,user_id: res.data.id} // detail对象，提供给事件监听函数
                            var myEventOption = {} // 触发事件的选项
                            this.triggerEvent('myevent', myEventDetail, myEventOption)
                            this.setData({    
                                showLogin: false,    
                            })
                            wx.showToast({
                                title: '登录成功',
                                icon: 'none',
                                duration: 2000,
                            })
                           

                        } else {
                            wx.showToast({
                                title: '发生错误，请稍后重试',
                                icon: 'none',
                                duration: 2000,
                            })
                            // app.alert("发生错误，请稍后重试")
                        }

                    },
                })
            }
        },
        onTap: function () {
            var myEventDetail = {} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            this.triggerEvent('myevent', myEventDetail, myEventOption)
        },
        closeLogin() {
            this.setData({
                showLogin: false
            })
        },
    },
   

})
