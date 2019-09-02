cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab,
        canvas:cc.Node
    },
    getMyInfo() {
        //获取当前用户信息
        // 必须是在用户已经授权的情况下调用
        wx.getUserInfo({
            success: function (res) {
                

            }
        })
    },
  
      compare(property) {
          return function (a, b) {
              var value1 = parseInt(a[property][0].value);
              var value2 = parseInt(b[property][0].value);
              return value2 - value1; //升序
          }
      },

    // 获取好友排行（云端数据）
    getUsersData() {
        let that = this;
        wx.getFriendCloudStorage({
            keyList: ['levelNow'],
            success: function (res) {
                that.content.removeAllChildren()
                    let rankData = res.data.sort(that.compare('KVDataList'));
                    let len = rankData.length;
                     for (var i = 0; i < len; i++) {
                         that.createUserBlock(rankData[i], i + 1);
                     }
               
            },
            fail: (res) => {
                console.error(res);
            }
        });
    },
  
    //添加排行数据到列表中
    createUserBlock(user,num) {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        node.x = 0;
       
        // set nickName
        let userName = node.getChildByName('nameBox').children[0].getComponent(cc.Label);
        userName.string = user.nickName || user.nickname;
            // set ranking
            let ranking = node.getChildByName(' serialNumber').children[0].getComponent(cc.Label);
            ranking.string = num;
        // set score
         let kdvList = user.KVDataList;
         let score = node.getChildByName('scoreBox').children[0].getComponent(cc.Label);
        score.string = "第"+ kdvList[0].value+"关";  

        // set avatar
        if (user.avatarUrl){
             cc.loader.load({
                 url: user.avatarUrl,
                 type: 'png'
             }, (err, texture) => {
                 if (err) console.error(err);
                 let userIcon = node.getChildByName('avatarBox').children[0].getComponent(cc.Sprite);
                 userIcon.spriteFrame = new cc.SpriteFrame(texture);
             });
        }
          
    },
    start() {
        if (typeof wx === 'undefined') {
            return;
        }
        this.getMyInfo();
        
       
    },
   
    onLoad() {
         let that = this;
         if (typeof wx === 'undefined') {
             return;
         }
        wx.onMessage(function (params) {
            if (params.updata) {
                console.log('hah')
                  that.getUsersData();
            }
            
        })
        
    }
    // update (dt) {},
});