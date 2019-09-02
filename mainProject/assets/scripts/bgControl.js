 let audioId;
cc.Class({
    extends: cc.Component,
    properties: {
        toggle1: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    start(){
            let isCheck;
            let that = this;
            if (typeof wx === "undefined") {
                isCheck = localStorage.getItem("bgchecked") || 1;
                audioId = localStorage.getItem("bgAudioId");
            } else {
                isCheck = wx.getStorageSync("bgchecked") || 1;
                audioId = wx.getStorageSync("bgAudioId");
            }
          
            let toggleNode = this.getComponent(cc.Toggle);
            if (isCheck == 1) {
                toggleNode.isChecked = true;
            } else {
                toggleNode.isChecked = false;
            }
    },
    onLoad() {
    
    },
    callBack: function (toggle, customEvent) {
            if (typeof wx === "undefined") {
                audioId = localStorage.getItem("bgAudioId");
            } else {
                audioId = wx.getStorageSync("bgAudioId");
            }
            //   cc.log(audioId)
        if (toggle.isChecked) {
            cc.audioEngine.resume(audioId)
            if (typeof wx === "undefined") {
                localStorage.setItem("bgchecked", 1)
            } else {
                wx.setStorageSync("bgchecked", 1);
            }
        } else {
              cc.audioEngine.pause(audioId)
            if (typeof wx === "undefined") {
                localStorage.setItem("bgchecked", 2)
            } else {
                wx.setStorageSync("bgchecked", 2);
            }
        }
    },

    update (dt) {},
});
 