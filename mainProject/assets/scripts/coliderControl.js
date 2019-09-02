
cc.Class({
    extends: cc.Component,

    properties: {
        toggle1: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         let isCheck;
         let that = this;
         if (typeof wx === "undefined") {
             isCheck = localStorage.getItem("colliderchecked")||1;
           
         } else {
             isCheck = wx.getStorageSync("colliderchecked")||1;
         }
         
           let toggleNode = this.getComponent(cc.Toggle);
           if(isCheck==1){
                toggleNode.isChecked = true;
           }else{
                toggleNode.isChecked = false;
           }
        },
    start () {
        
    },

    callBack: function (toggle,customEvent) {
          if (toggle.isChecked) {
              if (typeof wx === "undefined") {
                  localStorage.setItem("colliderchecked", 1)
              } else {
                  wx.setStorageSync("colliderchecked", 1);
              }

          } else {
              if (typeof wx === "undefined") {
                  localStorage.setItem("colliderchecked", 2)
              } else {
                  wx.setStorageSync("colliderchecked", 2);
              }
          }
    },
    
    // update (dt) {},
});
