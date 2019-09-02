// 控制音量大小
cc.Class({
    extends: cc.Component,

    properties: {
     musicId:null
    },


  onLoad () {
         
  },

    start () {
             let isCheck;
             let that = this;
             if (typeof wx === "undefined") {
               isCheck = localStorage.getItem("bgchecked") || 1;
             } else {
               isCheck = wx.getStorageSync("bgchecked") || 1;
             }
          cc.loader.loadRes('bgMusic', cc.AudioClip, (err, clip) => {
            this.musicId = cc.audioEngine.playMusic(clip, true);
            if(isCheck==2){
              cc.log(isCheck)
              cc.audioEngine.pause(this.musicId)
            }
            if (typeof wx === "undefined") {
              localStorage.setItem("bgAudioId", this.musicId);
            } else {
              wx.setStorageSync("bgAudioId", this.musicId)
            }
          });
        
    },
    onEnable(){

    },
    onDestroy(){
    }
});
