cc.Class({
    extends: cc.Component,
    properties: {
        rankBtn: cc.Node,
        wxContextBox: cc.Node,
        wxSubContext: cc.Node, //显示排行榜
        closeBtn: cc.Node
    },
    initAction() {
        let that = this;
        this._isShow = false;
        
        this._showAction = cc.moveTo(0.3, this.wxContextBox.x, 0);
        this._hideAction = cc.moveTo(0.3, this.wxContextBox.x, 1800);
        this.rankBtn.on("touchstart", function (params) {
            that.wxContextBox.active = true;
                that.wxContextBox.runAction(that._showAction);
        })
        this.closeBtn.on("touchstart", function (params) {
            that.wxContextBox.runAction(that._hideAction);
        })
    },
       // 将当前数据存储到微信服务器上
       setUsersInfo() {
             if (typeof wx === 'undefined') {
                 return;
             }
           let that = this;
           let curLevel= wx.getStorageSync("level")||1;
           var kvDataList = [ {
               key: "levelNow",
               value: curLevel.toString()
           }];


           wx.setUserCloudStorage({
               KVDataList: kvDataList,
               success: function (res) {
                     wx.getOpenDataContext().postMessage({
                         message: "User info get success."
                     });
               },
               fail: function (err) {
                   console.log(err)
               }
           })
       },


    initUserInfo() {
        if (typeof wx === 'undefined') {
            return;
        }
        let that = this;
        let systemInfo = wx.getSystemInfoSync(); //获取系统信息
       
        let storageUserInfo = wx.getStorageSync("userInfo");
        if (storageUserInfo){//已授权
            cc.log("已授权")
        }else{
              let width = systemInfo.windowWidth; //获取屏幕的宽
              let height = systemInfo.windowHeight; //获取屏幕的高
              let getInfoBtn = wx.createUserInfoButton({ //创建获取用户信息按钮
                  type: 'text',
                  text: '',
                  style: {
                      left: 0,
                      top: 0,
                      width: width,
                      height: height,
                      lineHeight: 40,
                      backgroundColor: '#00000000',
                      color: '#00000000',
                      textAlign: 'center',
                      fontSize: 10,
                      borderRadius: 4
                  }
              });

              getInfoBtn.onTap((res) => {
                  let userInfo = res.userInfo;
                  if (!userInfo) {
                     
                      return;
                  }
                  wx.setStorageSync("userInfo",userInfo)
                  getInfoBtn.hide();
                  getInfoBtn.destroy();

              });

        }
      
    },

    start() {
        this.initUserInfo();
        this.initAction();
       

    },
    onEnable(){
        if (typeof wx === 'undefined') {
            return;
        }
        this.setUsersInfo()
         wx.getOpenDataContext().postMessage({
            updata: "update."
        }); 
       
    },
    onLoad(){
        this.wxContextBox.active = false;
     this.wxContextBox.runAction(cc.moveTo(0, this.wxContextBox.x, 1800));
   
    }
    // update (dt) {},
});