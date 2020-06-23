// pages/personal/myDiscounts/myDiscounts.js
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
        let user_id=wx.getStorageSync('token')
        this.getState(user_id)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    getState(id){
        wx.request({
          url: 'https://ljjz.guaishe.com/index.php/index/api/myDiscount?id='+id,
          success: (result) => {
              this.setData({
                  status:result.data.info.status,
                  is_air:result.data.info.is_air
              })
              console.log(result)
          },
        })
    }
})